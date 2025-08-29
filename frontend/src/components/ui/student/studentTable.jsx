import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { formateDate } from "../../../utiils/formateDate";
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
          Are you sure you want to delete this student? This action cannot be
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

export const StudentTable = ({ students, onDeleteStudent, searchTerm }) => {

  const getHighlightedText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

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
      alert("Error Deleting Student");
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
            {/* <th className="bg-[#721c24] p-4 text-left text-white">Image</th> */}
            <th className="bg-[#721c24] p-4 text-left text-white">Img</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Id</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Name</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Father</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Mother</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Course</th>
            <th className="bg-[#721c24] p-4 text-left text-white">Mobile</th>
            <th className="w-[150px] bg-[#721c24] p-4 text-left text-white">
              Admit Date
            </th>
            <th className="bg-[#721c24] p-4  text-white text-center">
              Options
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody className="block md:table-row-group">
          {students.map((student) => (
            <tr
              key={student._id}
              onClick={() => navigate(`/student/view/${student._id}`)}
              className="mb-4 block cursor-pointer rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
            >
              {/* Image Cell */}
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden">
                  Image
                </span>
                <img
                  src={student.img || "/default.png"}
                  className="h-[50px] w-[50px] object-contain"
                  alt={student.name}
                />
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Id
                </span>
                {getHighlightedText(String(student.id), searchTerm)}
              </td>
              {/* Data Cells with Mobile Labels */}
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Name
                </span>
                {getHighlightedText(student.name, searchTerm)}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Father
                </span>
                {getHighlightedText(student.fatherName, searchTerm)}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Mother
                </span>
                {getHighlightedText(student.motherName, searchTerm)}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Course
                </span>
                {getHighlightedText(student.courseName, searchTerm)}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Mobile
                </span>
                {getHighlightedText(student.mobileNumber, searchTerm)}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Admit Date
                </span>
                {formateDate(student.createdAt)}
              </td>
              {/* Options/Buttons Cell */}
              <td className="flex items-center justify-between p-2 text-right md:table-cell md:p-4 md:text-left"  onClick={(e) => e.stopPropagation()}>
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Options
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/student/view/${student._id}`}
                    className="cursor-pointer rounded-full bg-sky-100 py-1.5 px-3 text-sm font-medium capitalize text-sky-800 transition hover:bg-sky-200"
                  >
                    View
                  </Link>
                  <Link
                    to={`/student/edit/${student._id}`}
                    className="cursor-pointer rounded-full bg-green-100 py-1.5 px-3 text-sm font-medium capitalize text-green-800 transition hover:bg-green-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteRequest(student._id)}
                    className="cursor-pointer rounded-full bg-red-100 py-1.5 px-3 text-sm font-medium capitalize text-red-800 transition hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
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
