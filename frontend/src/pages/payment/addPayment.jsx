import React from "react";
import { useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";
import { getApi } from "../../api";

import Loader from "../../components/ui/loader";
import ErrorMessage from "../../components/ui/errorMessage";
import StudentDetails from "../../components/payment/StudentDetails";
import PaymentForm from "../../components/payment/PaymentForm";
import PaymentHistory from "../../components/payment/PaymentHistory";
export default function AddPayment() {
    const { id } = useParams();
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["getStudentPayment", id],
        queryFn: () => getApi(`getStudentPayment/${id}`),
        keepPreviousData: true,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });


    if (isLoading) return <Loader />;
    if (isError) return <ErrorMessage message={error.message || "Unable to fetch student data"} />;

    return (
        <div className="bgGlass w-full  dark:bgGlass min-h-screen py-8">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <StudentDetails
                    student={data.data?.student}
                    courseName={data.data?.courseNames}
                    totalFee={data.data?.totalFee}
                    paymentSummary={data.data?.payments}
                />
                <PaymentForm
                    student={data.data?.student}
                    courseName={data.data?.courseNames}
                    totalFee={data.data?.totalFee}
                    refetch={refetch}
                    paymentSummary={data.data?.payments}
                />
            </div>
            <PaymentHistory data={data.data?.invoices} />
        </div>
    );
}