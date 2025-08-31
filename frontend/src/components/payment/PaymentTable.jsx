import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { formateDate } from "../../utiils/formateDate";


export default ({ students, searchTerm }) => {

    const getHighlightedText = (text, highlight) => {
        const safeText = text ? String(text) : "";

        if (!highlight.trim() || !safeText) {
            return <span>{safeText}</span>;
        }

        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = safeText.split(regex);

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
                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="block md:table-row-group">
                    {students.map((student) => (
                        <tr
                            key={student._id}
                            onClick={() => navigate(`/payment/add/${student._id}`)}
                            className="mb-4 block cursor-pointer rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
                        >
                            {/* Image Cell */}
                            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                                <span className="mr-4 font-semibold text-gray-700 md:hidden">
                                    Image
                                </span>
                                <img
                                    src={student?.img || "/default.png"}
                                    className="h-[50px] w-[50px] object-contain"
                                    alt={student.name || "Student"}
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
                                {/* {student.courseName} */}
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
                                {student.createdAt ? formateDate(student.createdAt) : "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};
