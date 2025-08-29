import React from "react";
import { LoadingSpinner } from "../ui/loader";
import { formateDate } from "../../utiils/formateDate";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PaymentHistory = ({ studentPayments, loading }) => {
  if (!studentPayments || studentPayments.length === 0) {
    return null;
  }

  console.log(studentPayments);

  // Sort payments once for both layouts
  const sortedPayments = React.useMemo(() => {
    return [...studentPayments].sort((a, b) => b.year - a.year || b.month - a.month);
  }, [studentPayments]);

  return (
    <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100 ">
                    <td className="py-3 px-4">{MONTH_NAMES[payment.month]}</td>
                    <td className="py-3 px-4">{payment.year}</td>
                    <td className="py-3 px-4">৳{payment.amountPaid}</td>
                    <td className="py-3 px-4">৳{payment.discount || 0}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {formateDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {sortedPayments.map((payment, index) => (
              <div key={index} className="bg-white/50 rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {MONTH_NAMES[payment.month]} {payment.year}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formateDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">৳{payment.amountPaid}</p>
                    {payment.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Discount: ৳{payment.discount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;