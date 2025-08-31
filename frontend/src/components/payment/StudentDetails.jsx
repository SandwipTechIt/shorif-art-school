import React from "react";
import { formateDate } from "../../utiils/formateDate";
import { calculateMonthlyDues } from "../../utiils/paymentLogic";


const StudentDetails = ({ student, courseName, totalFee, paymentSummary }) => {
  if (!student) return null;

  const { PaidMonths, DueMonths, TotalPaid, TotalDue } = calculateMonthlyDues(totalFee, student.createdAt, paymentSummary);

  return (
    <div className="bg-white/50 w-full rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Student Details</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Name:</span>
          <span className="font-medium dark:text-white">{student.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Father's Name:</span>
          <span className="font-medium dark:text-white">{student.fatherName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Mobile:</span>
          <span className="font-medium dark:text-white">{student.mobileNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Course:</span>
          <span className="font-medium dark:text-white">{courseName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Course Fee:</span>
          <span className="font-medium dark:text-white">৳{totalFee}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-white">Admission Date:</span>
          <span className="font-medium dark:text-white">{formateDate(student.createdAt)}</span>
        </div>
      </div>


      {paymentSummary && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-white">Payment Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Paid Months</p>
              <p className="text-xl font-bold text-green-700">{PaidMonths}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">Due Months</p>
              <p className="text-xl font-bold text-red-700">{DueMonths}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Total Paid</p>
              <p className="text-xl font-bold text-blue-700">৳{TotalPaid}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-600">Total Due</p>
              <p className="text-xl font-bold text-orange-700">৳{TotalDue}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
