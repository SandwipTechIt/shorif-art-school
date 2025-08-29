// PaymentTable.js
import React, { useRef } from "react";
import { formateDate } from "../../utiils/formateDate";
import { useReactToPrint } from "react-to-print";


const Invoice = ({ student, invoiceId, payment, discount, due, date }) => {
    return (
        <div className="p-6">
            <div className="flex justify-between">
                <p className="text-lg font-semibold">Student Payment Invoice</p>
                <p className="text-lg font-semibold">Date: <span className="font-normal">{formateDate(date)}</span></p>
            </div>
            <hr className="my-4" style={{ color: "black" }} />
            <div className="grid grid-cols-2 gap-4">
                <p className="font-semibold">Student Name: <span className="font-normal">{student?.name}</span></p>
                <p className="font-semibold">Invoice ID: <span className="font-normal">{invoiceId}</span></p>
                <p className="font-semibold">Father Name: <span className="font-normal">{student?.fatherName}</span></p>
                <p className="font-semibold">Payment: <span className="font-normal">{payment}</span></p>
                <p className="font-semibold">Course: <span className="font-normal">{student?.courseId.name}</span></p>
                <p className="font-semibold">Discount: <span className="font-normal">{discount}</span></p>
                <p className="font-semibold">Course Fee: <span className="font-normal">{student?.courseId.fee}</span></p>
                <p className="font-semibold">Current Due: <span className="font-normal">{due}</span></p>
            </div>
            <hr className="my-4" style={{ color: "black" }} />
            <div className="flex items-center justify-evenly">
                <div>
                    <p className="text-center mt-2">__________________</p>
                    <p className="text-center">Guardian Signature</p>
                </div>
                <div>
                    <p className="text-center mt-2">__________________</p>
                    <p className="text-center">Student Signature</p>
                </div>
            </div>
        </div>
    )
}

const paymentSummary = ({ courseFee, studentPayments, student }) => {

    const admissionDate = new Date(student.createdAt);
    const currentDate = new Date();

    // Calculate months from admission to current
    const monthsFromAdmission = (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 +
        (currentDate.getMonth() - admissionDate.getMonth());

    const paidMonths = studentPayments.length;
    const totalPaid = studentPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalDiscount = studentPayments.reduce((sum, p) => sum + (p.discount || 0), 0);
    const dueMonths = Math.max(0, monthsFromAdmission - paidMonths);
    const totalDue = dueMonths * courseFee;

    return totalDue;
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const PaymentTable = ({ payments, onPrint }) => {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <table className="w-full table-auto">
            <thead>
                <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Mobile Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Options</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment) => (
                    payment.studentId != null
                        ? (
                            <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">{MONTH_NAMES[payment.month]}</td>
                                <td className="py-3 px-4">{payment.year}</td>
                                <td className="py-3 px-4">{payment.studentId.name}</td>
                                <td className="py-3 px-4">{payment.studentId.mobileNumber}</td>
                                <td className="py-3 px-4">৳{payment.amountPaid}</td>
                                <td className="py-3 px-4">৳{payment.discount || 0}</td>
                                <td className="py-3 px-4 text-gray-600">
                                    {formateDate(payment.createdAt)}
                                </td>

                                <td className="py-3 px-4">
                                    <div className="hidden">
                                        <div ref={contentRef}>
                                            <Invoice
                                                student={payment.studentId}
                                                invoiceId={payment._id}
                                                payment={payment.amountPaid}
                                                discount={payment.discount}
                                                date={payment.createdAt}
                                                due={paymentSummary({ courseFee: payment.studentId.courseId.fee, studentPayments: payments, student: payment.studentId })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={reactToPrintFn}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                                        >
                                            Print
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                        : (<tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{MONTH_NAMES[payment.month]}</td>
                            <td className="py-3 px-4">{payment.year}</td>
                            <td className="py-3 px-4">Not Found</td>
                            <td className="py-3 px-4">Not Found</td>
                            <td className="py-3 px-4">{payment.amountPaid}</td>
                            <td className="py-3 px-4">{payment.discount}</td>
                            <td className="py-3 px-4 text-gray-600">
                                {formateDate(payment.createdAt)}
                            </td>

                            <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                    <button
                                        disabled
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                                    >
                                        Print
                                    </button>
                                </div>
                            </td>
                        </tr>
                        )
                ))}
            </tbody>
        </table>
    );
};

export default PaymentTable;