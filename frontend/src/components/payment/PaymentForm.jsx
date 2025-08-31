import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formateDate } from "../../utiils/formateDate";
import { MultiSelect } from "../../components/ui/multiselect";
import { calculateMonthlyDues } from "../../utiils/paymentLogic";
import { postApi } from "../../api";
import { toast } from "react-toastify";
const Invoice = ({ student, courseName, invoiceId, payment, due }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Student Payment Invoice</p>
        <p className="text-lg font-semibold">Date: <span className="font-normal">{formateDate(new Date())}</span></p>
      </div>
      <hr className="my-4" style={{ color: "black" }} />
      <div className="grid grid-cols-2 gap-4">
        <p className="font-semibold">Student Name: <span className="font-normal">{student?.name}</span></p>
        <p className="font-semibold">Invoice ID: <span className="font-normal uppercase">{invoiceId}</span></p>
        <p className="font-semibold">Father Name: <span className="font-normal">{student?.fatherName}</span></p>
        <p className="font-semibold">Payment: <span className="font-normal">{payment}</span></p>
        <p className="font-semibold">Course: <span className="font-normal">{courseName}</span></p>
        <p className="font-semibold">Remaining Due: <span className="font-normal">{Math.max(due, 0)}</span></p>
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

const PaymentForm = ({ student, courseName, totalFee, paymentSummary, refetch }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const { PaidMonths, DueMonths, TotalPaid, TotalDue } = calculateMonthlyDues(totalFee, student.createdAt, paymentSummary);


  const [state, setState] = useState({
    amount: "",
    month: "",
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

      console.log(state);
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