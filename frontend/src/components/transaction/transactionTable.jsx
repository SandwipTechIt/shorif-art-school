import React, { useState, useEffect } from "react";
import { formateDate } from "../../utiils/formateDate";
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
                    Are you sure you want to delete this transaction? This action cannot be
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

export default ({ orders, onDeleteOrder }) => {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const handleDeleteRequest = (productId) => {
        setDeleteConfirm(productId);
    };
    const handleConfirmDelete = async () => {
        try {
            await onDeleteOrder(deleteConfirm);
            setDeleteConfirm(null);
        } catch (error) {
            alert("Error Deleting Order");
        }
    };
    const handleCancelDelete = () => {
        setDeleteConfirm(null);
    };

    if (!orders || orders.length < 1) {
        return (
            <div className="min-h-[240px] flex flex-col items-center justify-center text-slate-500">
                <i className="fa-solid fa-money-bill text-5xl mb-4 " />
                <h2 className="text-xl font-semibold mb-2">No transactions found</h2>
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
                        <th className="bg-[#721c24] p-4 text-left text-white">Title</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Amount</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Type</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Date</th>
                        <th className="bg-[#721c24] p-4  text-white text-center">
                            Options
                        </th>
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="block md:table-row-group">
                    {orders.map((order) => (
                        <tr
                            key={order._id}
                            className="mb-4 cursor-pointer block rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
                        >
                            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                                    Title
                                </span>
                                {order.title.slice(0, 30)}
                            </td>
                            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                                    Amount
                                </span>
                                {order.amount}
                            </td>
                            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                                    Type
                                </span>
                                {order.type}
                            </td>
                            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                                    Date
                                </span>
                                {formateDate(order.createdAt)}
                            </td>
                            {/* Options/Buttons Cell */}
                            <td className="flex items-center justify-between p-2 text-right md:table-cell md:p-4 md:text-left cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                                    Options
                                </span>
                                <button
                                    onClick={() => handleDeleteRequest(order._id)}
                                    className="cursor-pointer rounded-full bg-red-100 py-1.5 px-3 text-sm font-medium capitalize text-red-800 transition hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Confirmation Modal */}
            {deleteConfirm && (
                <ConfirmDeleteModal
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};