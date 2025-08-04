import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage } from "../../components/ui/errorMessage";
import { LoadingSpinner } from "../../components/ui/loader";
import { StudentHeader } from "../../components/ui/student/studentHeader";
import { StudentTable } from "../../components/ui/student/studentTable";
import { Pagination } from "../../components/ui/pagination";
import { getApi, deleteApi } from "../../api";

const AllStudents = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const queryClient = useQueryClient();

  // Fetch students data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students", pagination.currentPage],
    queryFn: () => getApi(`getStudents?page=${pagination.currentPage}`),
    keepPreviousData: true,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // Update total pages when data changes
  useEffect(() => {
    if (data?.totalPages) {
      setPagination((prev) => ({ ...prev, totalPages: data.totalPages }));
    }
  }, [data]);

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id) => deleteApi(`deleteStudent/${id}`),
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["students"]);
    // },
    onSuccess: () =>
      queryClient.invalidateQueries(["students", pagination.currentPage]),
  });

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchData(null);
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchData(null);
      return;
    }

    try {
      const response = await getApi(`searchStudents/${searchTerm}`, {
        status: "active",
      });
      setSearchData(response);
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

  // Clear search when pagination changes
  useEffect(() => {
    setSearchData(null);
    setSearchTerm("");
  }, [pagination.currentPage]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => queryClient.invalidateQueries(["students"])}
      />
    );
  }

  return (
    <div id="allStudent">
      <div className="allStudentContainer flex flex-col">
        <StudentHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearch}
        />

        <div className="studentTable">
          <StudentTable
            students={searchData && searchTerm ? searchData : data.students}
            onDeleteStudent={(id) => deleteStudentMutation.mutate(id)}
          />
        </div>

        <div className="studentPagination">
          {pagination.totalPages > 1 && !searchData && !searchTerm && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllStudents;
