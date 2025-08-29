// controllers/payment.controller.js
import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import PaymentService from "../services/paymentService.js";
import { createError } from "../utils/error.js";

// New enrollment-based payment methods

/**
 * Get student payment history for a specific enrollment
 * GET /api/payments/student/:studentId/enrollment/:enrollmentId/history
 */
export const getStudentPaymentHistory = async (req, res, next) => {
  try {
    const { studentId, enrollmentId } = req.params;
    
    const result = await PaymentService.getStudentPaymentHistory(studentId, enrollmentId);
    
    if (!result.success) {
      return next(createError(400, result.message));
    }
    
    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Create payment for enrollment (auto-distributes across months)
 * POST /api/payments/enrollment/:enrollmentId
 */
export const createEnrollmentPayment = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const { studentId, amountPaid, discount = 0, paymentMethod = 'cash', transactionId, notes } = req.body;
    
    // Validate required fields
    if (!studentId || !amountPaid || amountPaid <= 0) {
      return next(createError(400, "Student ID and valid amount are required"));
    }
    
    if (discount < 0) {
      return next(createError(400, "Discount cannot be negative"));
    }
    
    const paymentData = {
      studentId,
      enrollmentId,
      amountPaid: parseFloat(amountPaid),
      discount: parseFloat(discount),
      paymentMethod,
      transactionId,
      notes
    };
    
    const result = await PaymentService.createPayment(paymentData);
    
    if (!result.success) {
      return next(createError(400, result.message));
    }
    
    return res.status(201).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Get all enrollments for a student with payment summary
 * GET /api/payments/student/:studentId/enrollments
 */
export const getStudentEnrollmentsWithPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'name fee')
      .populate('studentId', 'name');
    
    if (!enrollments.length) {
      return res.status(200).json({
        success: true,
        data: {
          student: null,
          enrollments: []
        }
      });
    }
    
    const enrollmentsWithPayments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const paymentHistory = await PaymentService.getStudentPaymentHistory(
          studentId, 
          enrollment._id.toString()
        );
        
        return {
          enrollment: {
            id: enrollment._id,
            selectedTime: enrollment.selectedTime,
            enrollmentDate: enrollment.enrollmentDate,
            status: enrollment.status
          },
          course: {
            id: enrollment.courseId._id,
            name: enrollment.courseId.name,
            fee: enrollment.courseId.fee
          },
          paymentSummary: paymentHistory.success ? paymentHistory.data.summary : null
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: enrollments[0].studentId._id,
          name: enrollments[0].studentId.name
        },
        enrollments: enrollmentsWithPayments
      }
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

// Legacy methods (keep for backward compatibility)

export const createPayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    let { amount, discount = 0 } = req.body;

    let newAmount = parseInt(amount);
    let newDiscount = parseInt(discount);


    // Validate amount
    if (!newAmount || newAmount <= 0) {
      return next(createError(400, "Amount must be a positive number"));
    }
    if (newAmount < newDiscount) {
      return next(createError(400, "Discount cannot be greater than amount"));
    }

    const student = await Student.findById(studentId).populate({
      path: "courseId",
      select: "fee",
    });

    if (!student) {
      return next(createError(404, "Student not found"));
    }

    if (!student.courseId) {
      return next(createError(400, "Student has no assigned course"));
    }


    const courseFee = parseInt(student.courseId.fee);
    if (!courseFee || courseFee <= 0) {
      return next(createError(400, "Course fee is not configured"));
    }


    const lastPayment = await Payment.findOne({ studentId }).sort({ year: -1, month: -1 });
    let lastMonth = getMonthFromDate(student.createdAt) - 1;

    if (lastPayment) {
      lastMonth = lastPayment.month;
    }
    let lastYear = getYearFromDate(student.createdAt);
    if (lastPayment) {
      lastYear = lastPayment.year;
    }
    const { months, amountPerMonth, discountPerMonth } = calculateFeeBreakdown(newAmount, newDiscount, courseFee);
    let payments = [];
    let message = "";
    for (let i = 1; i < months; i++) {
      newAmount -= amountPerMonth;
      newDiscount -= discountPerMonth;
      lastMonth += 1;
      if (lastMonth > 11) {
        lastMonth = 0;
        lastYear += 1;
      }
      message += ` ${MONTH_NAMES[lastMonth]},`;
      payments.push({
        studentId,
        month: lastMonth,
        year: lastYear,
        amountPaid: amountPerMonth,
        discount: discountPerMonth,
        status: "paid",
      });
    }
    // console.log(lastMonth);
    lastMonth += 1;
    if (lastMonth > 11) {
      lastMonth = 0;
      lastYear += 1;
    }

    // console.log(lastMonth);
    payments.push({
      studentId,
      month: lastMonth,
      year: lastYear,
      amountPaid: newAmount,
      discount: newDiscount,
      status: "paid",
    });

    message += ` ${MONTH_NAMES[lastMonth]} month of ${lastYear} Payment are paid successfully `;

    const response = await Payment.insertMany(payments);

    // Success response (assuming further logic would go here)
    return res.status(201).json({
      success: true,
      data: response,
      message: message,
    })
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message || "Internal server error"));
  }
};

export const searchStudent = async (req, res) => {
  const status = req.query.status || "active";
  try {
    const students = await Student.find({
      status,
      $or: [
        { name: { $regex: req.params.query, $options: "i" } },
        { fatherName: { $regex: req.params.query, $options: "i" } },
        { motherName: { $regex: req.params.query, $options: "i" } },
        { mobileNumber: { $regex: req.params.query, $options: "i" } },
        { whatsAppNumber: { $regex: req.params.query, $options: "i" } },
        { address: { $regex: req.params.query, $options: "i" } },
        { schoolName: { $regex: req.params.query, $options: "i" } },
      ],
    })
      .select("name fatherName motherName mobileNumber createdAt courseId")
      .populate({
        path: "courseId",
        select: "name fee",
      })
      .sort({ _id: -1 });


    res.status(200).json({
      students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentPayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const payments = await Payment.find({ studentId });
    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};


export const getAllPayments = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;


  try {
    const payments = await Payment.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate({
      path: "studentId",
      select: "name fatherName mobileNumber createdAt",
      populate: { path: "courseId", select: "name fee" },
    });
    const totalPages = Math.ceil((await Payment.countDocuments()) / limit);
    return res.status(200).json({
      success: true,
      data: payments,
      totalPages,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};


export const getAllPaymentsByInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payments = await Payment.findById(id).populate({
      path: "studentId",
      select: "name fatherName mobileNumber createdAt",
      populate: { path: "courseId", select: "name fee" },
    }); 
    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};