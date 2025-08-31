import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage } from "../../components/ui/errorMessage";
import Loader from "../../components/ui/loader";
import StudentTable from "../../components/payment/PaymentTable";
import { Pagination } from "../../components/ui/pagination";
import { getApi, deleteApi } from "../../api";
import { toast } from 'react-toastify';

const AllStudents = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    // Fetch students data using React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["students"],
        queryFn: () =>
            getApi(`getStudents`),
        keepPreviousData: true,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    // Delete student mutation
    const deleteStudentMutation = useMutation({
        mutationFn: (id) => deleteApi(`deleteStudent/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] }),
                toast.success("Student deleted successfully!", {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete student. Please try again.", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
    });



    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page on a new search
    };




    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return (
            <ErrorMessage
                error={error}
                onRetry={() => queryClient.invalidateQueries(["students"])}
            />
        );
    }
    // Filter students based on the search term
    const filteredStudents = data.filter((student) => {
        const term = searchTerm.toLowerCase();
        return (
            String(student.id).toLowerCase().includes(term) ||
            student.name.toLowerCase().includes(term) ||
            (student.fatherName &&
                student.fatherName.toLowerCase().includes(term)) ||
            (student.motherName &&
                student.motherName.toLowerCase().includes(term)) ||
            (student.courseName &&
                student.courseName.toLowerCase().includes(term)) ||
            (student.mobileNumber && student.mobileNumber.toLowerCase().includes(term))
        );
    });

    // Calculate pagination values
    const itemsPerPage = 20;
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStudents.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    return (
        <div id="allStudent">
            <div className="allStudentContainer flex flex-col">
                <div className="studentHeader gap-2  items-cente p-4 shadow-md dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between w-full bg-white">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Payments
                    </h1>
                    <input
                        type="text"
                        placeholder="Search by anything"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full h-full max-w-[400px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div className="studentTable">
                    <StudentTable
                        students={currentItems}
                        onDeleteStudent={(id) => deleteStudentMutation.mutate(id)}
                        searchTerm={searchTerm}
                    />
                </div>

                <div className="studentPagination">
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            totalPages={totalPages}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllStudents;



