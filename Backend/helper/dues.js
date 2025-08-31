import mongoose from "mongoose";
import Student from "../models/student.model.js";
import Payment from "../models/payment.model.js";
import Invoice from "../models/invoice.model.js";

export const getDues = async (month, year) => {
    try {
        // Get all students who have paid for this month
        const paidStudents = await Payment.find(
            { month, year },
            { studentId: 1 }
        ).distinct('studentId');

        // Get all students who haven't paid
        const unpaidStudents = await Student.find({
            _id: { $nin: paidStudents }
        });

        // Format the response
        const studentsDues = unpaidStudents.map(student => ({
            studentId: student._id,
            name: student.name,
            dueAmount: student.monthlyFee, // Assuming you have this field
            month,
            year
        }));

        return studentsDues;
    } catch (error) {
        console.error("Error fetching students dues:", error);
        throw error;
    }
}

export const getTotalPaid = async (studentId) => {
    try {
        const result = await Invoice.aggregate([
            { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        return result.length > 0 ? result[0].totalAmount : 0;
    } catch (error) {
        throw new Error(`Error calculating total amount: ${error.message}`);
    }
}

export const getMonthsBetween = (fromMonth, fromYear, toMonth, toYear) => {
    const result = [];
    let currentMonth = fromMonth;
    let currentYear = fromYear;

    while (currentYear < toYear || (currentYear === toYear && currentMonth <= toMonth)) {
        result.push({ month: currentMonth, year: currentYear });

        currentMonth++;
        if (currentMonth === 12) {
            currentMonth = 0;
            currentYear++;
        }
    }

    return result;
}