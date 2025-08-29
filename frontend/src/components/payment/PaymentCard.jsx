// PaymentCard.js
import React from "react";

import { formateDate } from "../../utiils/formateDate";
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const PaymentCard = ({ payment, onPrint }) => {
    return (
        <div className="bg-white/50 rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {MONTH_NAMES[payment.month]} {payment.year}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {formateDate(payment.createdAt)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        Student: {payment.studentId.name}
                    </p>
                    <p className="text-sm text-gray-700">
                        Mobile: {payment.studentId.mobileNumber}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-black">৳{payment.amountPaid}</p>
                    {payment.discount > 0 && (
                        <p className="text-sm text-green-600">
                            Discount: ৳{payment.discount }
                        </p>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
                <button
                    onClick={() => onPrint(payment._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
};

export default PaymentCard;