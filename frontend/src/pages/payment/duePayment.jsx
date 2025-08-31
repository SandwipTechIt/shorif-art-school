import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getApi, deleteApi } from "../../api";

import DueHeader from "../../components/payment/dueHeader";
import DueTable from "../../components/payment/dueTable";
import { Pagination } from "../../components/ui/pagination";
import Loader from "../../components/ui/loader";
import ErrorMessage from "../../components/ui/errorMessage";
export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const { data: payments, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["duePayments", currentPage],
        queryFn: () => getApi("getAllDues?page=" + currentPage),
        refetchOnMount: "always",
        refetchOnWindowFocus: true
    });

    useEffect(() => {
        if (payments) {
            setTotalPages(payments.totalPages);
        }
    }, [payments]);



    const handleDeleteRequest = async (studentId) => {
        try {
            const response = await deleteApi(`deletePayment/${studentId}`);
            if (response.success) {
                toast.success(response.message);
                refetch();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to delete student");
        }
    }
    if (isLoading) return <Loader />;
    if (isError) return <ErrorMessage message={error.message || "Unable to fetch student data"} />;
    return (
        <div>
            <DueHeader onSearch={setSearchResults} />
            {searchResults ? (
                <DueTable students={searchResults} onDeleteStudent={handleDeleteRequest} />
            ) : (
                <DueTable students={payments.data} onDeleteStudent={handleDeleteRequest} />
            )}
            <div className="studentPagination">
                {totalPages > 1 && !searchResults && (
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </div>
    )
}