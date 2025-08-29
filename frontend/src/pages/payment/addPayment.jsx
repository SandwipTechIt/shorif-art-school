import React from "react";
import StudentSearch from "../../components/payment/StudentSearch";
import StudentDetails from "../../components/payment/StudentDetails";
import PaymentForm from "../../components/payment/PaymentForm";
import PaymentHistory from "../../components/payment/PaymentHistory";
import { usePaymentLogic } from "../../hooks/usePaymentLogic";

export default function AddPayment() {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        selectedStudent,
        studentPayments,
        loading,
        searchLoading,
        paymentLoading,
        errors,
        successMessage,
        paymentForm,
        handleSearch,
        handleSelectStudent,
        calculatePaymentSummary,
        handlePaymentSubmit,
        handleInputChange
    } = usePaymentLogic();



    const paymentSummary = calculatePaymentSummary();

    return (
        <div className="bgGlass w-full  dark:bgGlass min-h-screen py-8">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {/* Student Search */}
                <StudentSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchResults={searchResults}
                    searchLoading={searchLoading}
                    errors={errors}
                    onSearch={handleSearch}
                    onSelectStudent={handleSelectStudent}
                />

                {/* Selected Student Details */}
                {selectedStudent && !searchResults.length && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Student Info & Payment Summary */}
                        <StudentDetails
                            student={selectedStudent}
                            paymentSummary={paymentSummary}
                            // studentPayments={studentPayments}
                        />

                        {/* Payment Form */}
                        <PaymentForm
                            paymentForm={paymentForm}
                            paymentLoading={paymentLoading}
                            errors={errors}
                            successMessage={successMessage}
                            onSubmit={handlePaymentSubmit}
                            onInputChange={handleInputChange}
                            selectedStudent={selectedStudent}
                            paymentSummary={paymentSummary}
                            studentPayments={studentPayments}
                        />
                    </div>
                )}

                {/* Payment History */}
                {selectedStudent && !searchResults.length && (
                    <PaymentHistory
                        studentPayments={studentPayments}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}