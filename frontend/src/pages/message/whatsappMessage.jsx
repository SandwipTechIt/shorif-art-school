// pages/WhatsAppMessagePage.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "../../api.jsx";
import StudentTable from "../../components/message/whatsAppMessageTable";
import SearchBar from "../../components/message/searchbar";
import StatusFilter from "../../components/message/StatusFilter";
import Pagination from "../../components/message/Pagination";
import MessageForm from "../../components/message/MessageForm";

const WhatsAppMessagePage = () => {
    const [status, setStatus] = useState("active");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [totalPages, setTotalPages] = useState(1);


    const { data: studentsData, isLoading, isError, error } = useQuery({
        queryKey: ["students", status, currentPage, isSearchMode, searchTerm],
        queryFn: async () => {
            if (isSearchMode && searchTerm) {
                const response = await getApi(`searchStudents/${searchTerm}`, {
                    status
                });
                setTotalPages(Math.ceil(response.totalPages) || 1);
                return response;
            } else {
                const response = await getApi(`getStudents?page=${currentPage}`, {
                    status,
                });
                setTotalPages(Math.ceil(response.totalPages) || 1);
                return response;
            }
        },
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const handleSearch = (term) => {
        setSearchTerm(term);
        setIsSearchMode(true);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setIsSearchMode(false);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
        setIsSearchMode(false);
        setSearchTerm("");
    }, [status]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Error loading students: {error.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">WhatsApp Messages</h1>

            <MessageForm message={message} setMessage={setMessage} />

            <div className="bg-white/85 dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-white">Student List</h2>
                        <p className="text-gray-500 dark:text-gray-400">Manage and message students</p>
                    </div>
                    <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
                </div>

                <StatusFilter status={status} setStatus={setStatus} />

                <StudentTable students={studentsData?.students || studentsData} message={message} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default WhatsAppMessagePage;