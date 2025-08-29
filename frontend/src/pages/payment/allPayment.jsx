// StudentPayment.js
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApi } from "../../api.jsx";
import PaymentTable from "../../components/payment/PaymentTable";
import PaymentCard from "../../components/payment/PaymentCard";
import Pagination from "../../components/payment/Pagination";
import SearchForm from "../../components/payment/SearchForm";

const StudentPayment = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const queryClient = useQueryClient();

    const { data: allPaymentsData, isLoading: allPaymentsLoading, isError: allPaymentsError, error: allPaymentsErrorMsg } = useQuery({
        queryKey: ["allPayments", currentPage],
        queryFn: () => getApi(`getAllPayments?page=${currentPage}`),
        enabled: !isSearching,
        keepPreviousData: true,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    // Query for search by invoice ID
    const { data: searchData, isLoading: searchLoading, isError: searchError, error: searchErrorMsg } = useQuery({
        queryKey: ["searchPayment", searchTerm],
        queryFn: () => getApi(`getAllPaymentByInvoice/${searchTerm}`),
        enabled: isSearching && searchTerm.length > 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const handleSearch = (term) => {
        setSearchTerm(term);
        setIsSearching(!!term);
        setCurrentPage(1);
    };

    const handlePrint = (invoiceId) => {
        window.open(`/print-invoice/${invoiceId}`, '_blank');
    };



    const handleClearSearch = () => {
        setSearchTerm("");
        setIsSearching(false);
        setCurrentPage(1);
    };

    // Determine which data to use and loading/error states
    const isLoading = isSearching ? searchLoading : allPaymentsLoading;
    const isError = isSearching ? searchError : allPaymentsError;
    const error = isSearching ? searchErrorMsg : allPaymentsErrorMsg;
    const data = isSearching ? searchData : allPaymentsData;

    if (isLoading) return <div className="text-center py-8">Loading payments...</div>;
    if (isError) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
    
    // Handle different data structures for search vs all payments
    const payments = isSearching ? (data?.data ? [data.data] : []) : (data?.data || []);
    
    if (!payments.length || !Array.isArray(payments)) return <div className="text-center py-8">No payments found</div>;

    return (
        <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <div className="paymentHeader flex flex-col md:flex-row justify-between md:items-center  mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isSearching ? `Search Results for "${searchTerm}"` : "All Payments"}
                </h2>
                <div className="flex gap-2">
                    <SearchForm onSearch={handleSearch} />
                    {isSearching && (
                        <button
                            onClick={handleClearSearch}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop/Tablet View */}
            <div className="hidden md:block overflow-x-auto">
                <PaymentTable
                    payments={payments || []}
                    onPrint={handlePrint}
                />
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {payments.map((payment) => (
                    payment.studentId != null ? (
                        <PaymentCard
                            key={payment._id}
                            payment={payment}
                            onPrint={handlePrint}
                        />
                    ) : null
                ))}
            </div>

            {/* Only show pagination for all payments, not for search results */}
            {!isSearching && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={data?.totalPages || 1}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default StudentPayment;