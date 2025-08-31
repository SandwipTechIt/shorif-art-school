import Student from "../models/student.model.js";
import Payment from "../models/payment.model.js";
import Invoice from "../models/invoice.model.js";
import PaymentService from "../services/paymentService.js";
import { createError } from "../utils/error.js";
import { getStudentEnrolledCourseName } from "../helper/getStudentEnrolledCourseName.js";
import mongoose from "mongoose";

export const getStudentPayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId)
      .select("name fatherName mobileNumber createdAt");
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    const { courseNames, totalFee } = await getStudentEnrolledCourseName(studentId);

    const payments = await Payment.find({ studentId });
    const invoices = await Invoice.find({ studentId })
    return res.status(200).json({
      success: true,
      data: {
        student,
        courseNames,
        totalFee,
        payments,
        invoices
      },
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

export const createPayment = async (req, res, next) => {

  try {

    const { studentId } = req.params;
    let { amount, month: months, due } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    if (!amount || !months?.length) {
      return next(createError(400, "Amount and month are required"));
    }

    const { courseNames, totalFee } = await getStudentEnrolledCourseName(studentId);

    const paymentIds = [];
    for (const month of months) {
      const payment = new Payment({
        studentId,
        amount: totalFee,
        month,
        year: new Date().getFullYear(),
      });
      const savedPayment = await payment.save();
      paymentIds.push(savedPayment.id);
    }

    const invoice = new Invoice({
      studentId,
      studentID: student.id,
      months,
      amount,
      due,
      paymentIds
    });
    await invoice.save();
    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      invoice,
    })
  } catch (error) {
    console.log(error);
    return next(createError(500, error.message || "Internal server error"));
  }
};


export const getAllPayments = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;


  try {
    const payments = await Invoice.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate({
      path: "studentId",
      select: "name fatherName mobileNumber createdAt"
    })

    const totalPages = Math.ceil((await Invoice.countDocuments()) / limit);

    const paymentsWithCourseNames = await Promise.all(payments.map(async (payment) => {
      const { courseNames, totalFee } = await getStudentEnrolledCourseName(payment.studentId._id);
      return {
        ...payment._doc,
        courseNames,
        totalFee,
      };
    }));

    return res.status(200).json({
      success: true,
      data: paymentsWithCourseNames,
      totalPages,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};


export const searchPayments = async (req, res, next) => {
  try {
    const { fromDate, toDate, searchQuery } = req.body;
    const query = {};

    if (fromDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
      };
    }

    if (toDate) {
      query.createdAt = {
        $lte: new Date(toDate),
      };
    }

    if (searchQuery) {
      if (mongoose.Types.ObjectId.isValid(searchQuery)) {
        console.log("valid");
        query._id = searchQuery;
      } else {
        console.log("invalid");
        query.studentID = searchQuery;
      }
    }

    const payments = await Invoice.find(query).sort({ createdAt: -1 }).populate({
      path: "studentId",
      select: "name fatherName mobileNumber createdAt"
    });

    const paymentsWithCourseNames = await Promise.all(payments.map(async (payment) => {
      const { courseNames, totalFee } = await getStudentEnrolledCourseName(payment.studentId._id);
      return {
        ...payment._doc,
        courseNames,
        totalFee,
      };
    }));

    return res.status(200).json({
      success: true,
      data: paymentsWithCourseNames,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const payment = await Invoice.findByIdAndDelete(studentId);
    if (!payment) {
      return next(createError(404, "Payment not found"));
    }
    const payments = await Payment.deleteMany({ _id: { $in: payment.paymentIds } });
    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      payment,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};


export const getAllDues = async (req, res, next) => {
  const { fromDate, toDate, searchQuery } = req.body;
  try {
    
    const currentMonth=new Date().getMonth();
    const currentYear=new Date().getFullYear();
    const studentsIds=await Student.find({}).select("_id");

    const payments=await Payment.find({month:currentMonth,year:currentYear,studentId:{$in:studentsIds}});




    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

// export const getStudentPaymentHistory = async (req, res, next) => {
//   try {
//     const { studentId, enrollmentId } = req.params;

//     const result = await PaymentService.getStudentPaymentHistory(studentId, enrollmentId);

//     if (!result.success) {
//       return next(createError(400, result.message));
//     }

//     return res.status(200).json({
//       success: true,
//       data: result.data
//     });
//   } catch (error) {
//     return next(createError(500, error.message || "Internal server error"));
//   }
// };