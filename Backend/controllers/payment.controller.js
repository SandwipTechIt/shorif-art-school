import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Payment from "../models/payment.model.js";
import Invoice from "../models/invoice.model.js";
import Transaction from "../models/transaction.model.js";
import { createError } from "../utils/error.js";
import { getStudentEnrolledCourseName } from "../helper/getStudentEnrolledCourseName.js";
import { getMonthsBetween, getTotalPaid } from "../helper/dues.js";


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


    const transactionData = {
      title: "Student Payment",
      amount: amount,
      type: "income",
      createdAt: new Date()
    }
    const transaction = new Transaction(transactionData);
    await transaction.save();

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
      select: "name fatherName mobileNumber createdAt img"
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
    console.log(error);
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
        query._id = searchQuery;
      } else {
        query.studentID = searchQuery;
      }
    }

    const payments = await Invoice.find(query).sort({ createdAt: -1 }).populate({
      path: "studentId",
      select: "name fatherName mobileNumber createdAt img"
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

    const transactionData = {
      title: "Student Payment Cancelled",
      amount: payment.amount,
      type: "expense",
      createdAt: new Date()
    }
    const transaction = new Transaction(transactionData);
    await transaction.save();

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
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  try {
    const students = await Student.find({})
      .skip(skip).limit(limit).sort({ createdAt: 1 }).select("name id  img mobileNumber whatsAppNumber createdAt")


    const studentsWithDues = await Promise.all(
      students.map(async (student) => {
        const amountPaid = await getTotalPaid(student._id.toString());
        const currentDate = new Date();
        const monthsEnrolled = (currentDate.getFullYear() - student.createdAt.getFullYear()) * 12 +
          (currentDate.getMonth() - student.createdAt.getMonth()) + 1;
        const { courseNames, totalFee } = await getStudentEnrolledCourseName(student._id.toString());

        const totalExpected = totalFee * monthsEnrolled;
        const outstandingDues = totalExpected - amountPaid;


        const studentObj = student.toObject(); // or student.toJSON()
        studentObj.courseNames = courseNames;
        studentObj.dues = outstandingDues;



        return studentObj;
      })
    );

    const studentsWithOutstandingDues = studentsWithDues.filter(student => student.dues > 0);

    const totalPages = Math.ceil((await Student.countDocuments()) / limit);

    return res.status(200).json({
      success: true,
      data: studentsWithOutstandingDues,
      totalPages
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};



export const searchDues = async (req, res, next) => {

  const { fromDate, toDate, searchQuery } = req.body;

  try {
    const from = fromDate ? new Date(fromDate) : new Date(2025, 8);
    const to = toDate ? new Date(toDate) : new Date();

    const startMonth = from.getMonth();
    const startYear = from.getFullYear();

    const endMonth = to.getMonth();
    const endYear = to.getFullYear();

    const range = getMonthsBetween(startMonth, startYear, endMonth, endYear);

    const query = {
      status: "active"
    }
    if (searchQuery) {
      query.id = searchQuery
    }
    // 1. All student ids that should pay
    const allStudentIds = await Student.find(query).distinct('_id');

    // 2. Students that have **any** payment in the range
    const paidAny = await Payment.aggregate([
      {
        $match: {
          studentId: { $in: allStudentIds },
          $or: range
        }
      },
      {
        $group: {
          _id: '$studentId'
        }
      }
    ]);


    const unpaidStudents = await Student.find({
      _id: { $nin: paidAny },
      ...query
    });

    const unpaidStudentsWithCourseNames = await Promise.all(
      unpaidStudents.map(async (student) => {
        const { courseNames, totalFee } = await getStudentEnrolledCourseName(student._id.toString());
        return {
          ...student.toObject(),
          courseNames,
          totalFee,
          dues: totalFee * range.length,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: unpaidStudentsWithCourseNames,
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }


};