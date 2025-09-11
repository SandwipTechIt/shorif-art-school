import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { formateDate } from "../../utiils/formateDate";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getMonthNames(indices) {
    return indices
      .map(i => MONTH_NAMES[i])  // pick the name at that index
      .filter(Boolean)           // discard undefined for invalid indexes
      .join(",");
  }


const ConfirmDeleteModal = ({ onCancel, onConfirm }) => {
    useEffect(() => {
        // Store original body overflow value
        const originalOverflow = document.body.style.overflow;
        // Prevent scrolling on body
        document.body.style.overflow = "hidden";
        // Cleanup function to restore scrolling when modal closes
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []); // Empty dependency array ensures this runs only on mount/unmount

    const handleOutsideClick = (e) => {
        // Check if the click is directly on the backdrop (not on the modal content)
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
            onClick={handleOutsideClick}
        >
            <div
                className="rounded-lg bg-white p-6 shadow-xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from propagating
            >
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            ></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Confirm Deletion</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this payment? This action cannot be
                    undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};


// const Invoice = ({ student, courseName, invoiceId, payment, due, paymentMonth }) => {
//     const monthNames=getMonthNames(paymentMonth)
//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center">
//                 <img src="/logo.png" className="w-24" alt="" />
//                 <h1 className="text-3xl font-bold uppercase">Shorif Art School</h1>
//             </div>
//             <div className="flex justify-between">
//                 <p className="text-lg font-semibold">Student Payment Invoice</p>
//                 <p className="text-lg font-semibold">Date: <span className="font-normal">{formateDate(new Date())}</span></p>
//             </div>
//             <hr className="my-4" style={{ color: "black" }} />
//             <div className="grid grid-cols-2 gap-4">
//                 <p className="font-semibold">Invoice ID: <span className="font-normal uppercase">{invoiceId}</span></p>
//                 <p className="font-semibold">Month: <span className="font-normal">{monthNames}</span></p>
//                 <p className="font-semibold">Student Name: <span className="font-normal">{student?.name}</span></p>
//                 <p className="font-semibold">Payment: <span className="font-normal">{payment}</span></p>
//                 <p className="font-semibold">Course: <span className="font-normal">{courseName}</span></p>
//                 <p className="font-semibold">Remaining Due: <span className="font-normal">{due}</span></p>
//             </div>
//             <hr className="my-4" style={{ color: "black" }} />
//             <div className="flex items-center justify-evenly">
//                 <div>
//                     <p className="text-center mt-2">__________________</p>
//                     <p className="text-center">Guardian Signature</p>
//                 </div>
//                 <div>
//                     <p className="text-center mt-2">__________________</p>
//                     <p className="text-center">Student Signature</p>
//                 </div>
//             </div>
//         </div>
//     )
// }



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
                        <h1 className="text-2xl font-bold text-indigo-900">Shorif Art School</h1>
                        <p className="text-sm text-indigo-600">Halishahar, Chittagong</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-700">Payment Invoice</p>
                    <p className="text-sm text-gray-500">{formateDate(new Date())}</p>
                </div>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent my-4"></div>
            
            {/* Invoice Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex-grow">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Invoice Details</p>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Invoice ID:</span>
                                    <span className="font-medium text-gray-800">{invoiceId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Month:</span>
                                    <span className="font-medium text-gray-800">{monthNames}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Student Information</p>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium text-gray-800">{student?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Course:</span>
                                    <span className="font-medium text-gray-800">{courseName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Payment Summary */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Payment Amount</p>
                            <p className="text-xl font-bold text-indigo-700">{payment}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Remaining Due</p>
                            <p className="text-xl font-bold text-purple-700">{due}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Signature Section */}
            <div className="flex justify-evenly items-center mt-4">
                <div className="text-center">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-1"></div>
                    <p className="text-xs text-gray-500">Guardian Signature</p>
                </div>
                <div className="text-center">
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-1"></div>
                    <p className="text-xs text-gray-500">Student Signature</p>
                </div>
                
            </div>
        </div>
    );
};



const StudentTableRow = ({ student, onDeleteRequest }) => {
    // Each row now gets its own ref and its own print handler
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef })

    return (
        <tr className="mb-4 block rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white">
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Image</span>
                <img
                    src={student.studentId.img || "/default.png"}
                    className="h-[50px] w-[50px] object-contain"
                    alt={student.name || "Student"}
                />
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Id</span>
                {String(student?.studentID)}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Id</span>
                {String(student?.studentId?.name)}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Month</span>
                {student.months?.map((i) => MONTH_NAMES[i]).join(", ")}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Amount</span>
                {student.amount}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Due</span>
                {student.due || 0}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Date</span>
                {student.createdAt ? formateDate(student.createdAt) : "N/A"}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Options</span>
                <div className="flex items-center gap-2">
                    {/* This div holds the content to be printed, referenced by this component's unique ref */}
                    <div className="hidden">
                        <div ref={contentRef}>
                            <Invoice
                                student={student.studentId}
                                courseName={student.courseNames}
                                fee={student.totalFee}
                                invoiceId={student?._id?.toString()}
                                payment={student?.amount}
                                due={student?.due}
                                paymentMonth={student?.months}
                            />
                        </div>
                    </div>
                    {/* This button calls this component's unique print handler */}
                    <button
                        onClick={reactToPrintFn}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium"
                    >
                        Print
                    </button>
                    <button
                        onClick={() => onDeleteRequest(student._id)}
                        className="cursor-pointer rounded bg-red-100 py-2 px-4 font-medium capitalize text-red-800 transition hover:bg-red-200"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ({ students, onDeleteStudent }) => {

    const navigate = useNavigate()
    const [deleteConfirm, setDeleteConfirm] = useState(null);


    const handleDeleteRequest = (studentId) => {
        setDeleteConfirm(studentId);
    };
    const handleConfirmDelete = async () => {
        try {
            await onDeleteStudent(deleteConfirm);
            setDeleteConfirm(null);
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (!students || students.length < 1) {
        return (
            <div className="min-h-[240px] flex flex-col items-center justify-center text-slate-500">
                <i className="fa-solid fa-users-slash text-5xl mb-4 text-slate-300" />
                <h2 className="text-xl font-semibold mb-2">No students found</h2>
            </div>
        );
    }

    return (
        <div
            id="product-table"
            className="m-0 overflow-x-auto rounded-none shadow-none md:m-2 md:rounded-lg md:shadow-md"
        >
            <table className="w-full border-collapse bg-white dark:bg-gray-800">
                {/* Desktop Table Header */}
                <thead className="hidden md:table-header-group">
                    <tr>
                        <th className="bg-[#721c24] p-4 text-left text-white">Image</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Id</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Name</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Month</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Amount</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Due</th>
                        <th className="w-[150px] bg-[#721c24] p-4 text-left text-white">
                            Date
                        </th>
                        <th className="w-[150px] bg-[#721c24] p-4 text-left text-white">
                            Options
                        </th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="block md:table-row-group">
                    {students.map((student, index) => (
                        <StudentTableRow
                            student={student}
                            onDeleteRequest={handleDeleteRequest}
                            key={index}
                        />
                    ))}
                </tbody>
            </table>
            {deleteConfirm && (
                <ConfirmDeleteModal
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};
