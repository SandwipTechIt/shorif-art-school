import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formateDate } from "../../utiils/formateDate";


const Invoice = ({ student, invoiceId, payment, discount, due }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Student Payment Invoice</p>
        <p className="text-lg font-semibold">Date: <span className="font-normal">{formateDate(new Date())}</span></p>
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
        <p className="font-semibold">Remaining Due: <span className="font-normal">{due}</span></p>
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



const PaymentForm = ({
  paymentForm,
  paymentLoading,
  errors,
  successMessage,
  onSubmit,
  onInputChange,
  selectedStudent,
  paymentSummary,
  studentPayments
}) => {
  const amountInputRef = useRef(null);
  const discountInputRef = useRef(null);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Handle Enter key navigation
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        handlePaymentSubmit();
      }
    }
  };



  return (
    <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Add Payment</h2>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      {errors.payment &&
        <div
          className={`mb-4 p-3 rounded text-sm font-medium bg-red-100 text-red-700`}
        >
          {errors.payment}
        </div>
      }
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
            Payment Amount <span className="text-red-500">*</span>
          </label>
          <input
            ref={amountInputRef}
            type="number"
            name="amount"
            value={paymentForm.amount}
            onChange={onInputChange}
            onKeyDown={(e) => handleKeyDown(e, discountInputRef)}
            placeholder="Enter payment amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors dark:border-gray-600 focus:outline-none"
            min="1"
            step="1"
            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
            onBlur={(e) => e.target.removeEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
            Discount (Optional)
          </label>
          <input
            ref={discountInputRef}
            type="number"
            name="discount"
            value={paymentForm.discount}
            onChange={onInputChange}
            onKeyDown={(e) => handleKeyDown(e, null)}
            placeholder="Enter discount amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors dark:border-gray-600 focus:outline-none"
            min="0"
            step="1"
            onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
            onBlur={(e) => e.target.removeEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
          />
          {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
        </div>
        <button
          type="submit"
          disabled={paymentLoading}
          onClick={onSubmit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors font-medium"
        >
          {paymentLoading ? (
            <>
              <i className="fas fa-spinner animate-spin mr-2"></i>
              Processing Payment...
            </>
          ) : (
            <>
              <i className="fas fa-credit-card mr-2"></i>
              Add Payment
            </>
          )}
        </button>

        <div className="hidden">
          <div ref={contentRef}>
            <Invoice
              student={selectedStudent}
              invoiceId={studentPayments?.[studentPayments.length - 1]?._id}
              payment={studentPayments?.[studentPayments.length - 1]?.amountPaid}
              discount={studentPayments?.[studentPayments.length - 1]?.discount}
              due={paymentSummary.totalDue}
            />
          </div>
        </div>

        {
          successMessage && (
            <button
              onClick={reactToPrintFn}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors font-medium"
            >
              Print
            </button>
          )
        }
      </div>
    </div>
  );
};
export default PaymentForm;