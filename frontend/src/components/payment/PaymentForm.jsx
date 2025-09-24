import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formateDate } from "../../utiils/formateDate";
import { MultiSelect } from "../../components/ui/multiselect";
import { calculateMonthlyDues } from "../../utiils/paymentLogic";
import { postApi } from "../../api";
import { toast } from "react-toastify";



const months = [
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" },
];
function getMonthNames(indices) {
  if (!indices || !Array.isArray(indices)) return "";
  return indices
    .map(i => {
      const month = months.find(m => m.value === String(i));
      return month ? month.label : null;
    })
    .filter(Boolean) // removes nulls in case of invalid indices
    .join(", ");
}


const Invoice = ({ student, courseName, invoiceId, payment, due, paymentMonth }) => {
  const monthNames = getMonthNames(paymentMonth);

  return (
    <div className="max-h-[148.5mm] w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg px-8 pt-6 pb-2 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <img src="/logo.png" className="w-16 h-16" alt="Shorif Art School" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Shorif Art School</h1>
            <p className="text-sm text-black">Halishahar, Chittagong</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-black">Payment Invoice</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px border border-black my-4"></div>

      {/* Invoice Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex-grow">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-black uppercase tracking-wider">Invoice Details</p>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <span className="text-black">Invoice ID:</span>
                  <span className="text-black font-semibold">{invoiceId?.toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">Month:</span>
                  <span className="text-black font-semibold">{monthNames}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">Date:</span>
                  <span className="text-black font-semibold">{formateDate(new Date())}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-black uppercase tracking-wider">Student Information</p>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <span className="text-black">Name:</span>
                  <span className="text-black font-semibold">{student?.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">ID:</span>
                  <span className="text-black font-semibold">{student?.id}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">Course:</span>
                  <span className="text-black font-semibold">{courseName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-6 pt-4 border-t border-black">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-black">Payment Amount</p>
              <p className="text-xl font-semibold text-black">{payment}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-black">Remaining Due</p>
              <p className="text-xl font-semibold text-black">{due}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-evenly items-center mt-4">
        <div className="text-center">
          <div className="h-px w-32 border border-black mb-1"></div>
          <p className="text-xs text-black">Authorized</p>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ student, courseName, totalFee, paymentSummary, refetch }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { PaidMonths, DueMonths, TotalPaid, TotalDue } = calculateMonthlyDues(totalFee, student.createdAt, paymentSummary);


  const [state, setState] = useState({
    amount: totalFee,
    month: [new Date().getMonth().toString()],
  });
  const [error, setError] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handelChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    setError({});
  }

  const validate = () => {
    if (!state.amount) {
      setError((prev) => ({ ...prev, amount: "Please enter amount" }));
      return false;
    }
    if (!state.month.length) {
      setError((prev) => ({ ...prev, month: "Please select at least one month" }));
      return false;
    }
    return true;
  }
  const onSubmit = async () => {
    try {
      if (!validate()) return;

      setPaymentLoading(true);
      const response = await postApi(`createPayment/${student._id}`, { ...state, due: Math.max(TotalDue - state.amount, 0) });
      if (response.success) {
        toast.success("Payment added successfully!", {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        refetch();
        setOnSuccess(true);
        setResponse(response.invoice);
        setState({ amount: "", month: "" });
      }
      setPaymentLoading(false);
      setOnSuccess(true);
    } catch (error) {
      setPaymentLoading(false);
      toast.error(error?.response?.data?.message || "Failed to add payment. Please try again.", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <div className="bg-white/50 w-full rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Add Payment</h2>

      <div>
        <MultiSelect
          options={months}
          selectedOptions={state.month}
          onSelectionChange={(value) => setState({ ...state, month: value })}
        />
        {error.month && !state.month?.length && <p className="text-red-500 text-sm mt-2">{error.month}</p>}
      </div>

      <div className="space-y-4 pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
            Payment Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="amount"
            value={state.amount}
            onChange={handelChange}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors dark:border-gray-600 focus:outline-none"
          />
          {error.amount && <p className="text-red-500 text-sm mt-2">{error.amount}</p>}
        </div>

        <div>
          <p className="flex items-center justify-between"><span className="font-semibold">Taken amount</span> {state.amount || 0}</p>
          <p className="flex items-center justify-between"><span className="font-semibold">Total amount</span> {totalFee * state.month.length || 0}</p>
          <p className="flex items-center justify-between"><span className="font-semibold">Due</span> {Math.max(TotalDue - state.amount, 0) || 0}</p>

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
              student={student}
              courseName={courseName}
              fee={totalFee}
              invoiceId={response?._id?.toString()}
              payment={response?.amount}
              due={TotalDue}
              paymentMonth={response?.months}
            />
          </div>
        </div>

        {
          onSuccess && (
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