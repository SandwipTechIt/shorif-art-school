import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";



const StudentTableRow = ({ student,handleClick }) => {

    return (
        <tr className="mb-4 block rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white cursor-pointer"
        // onClick={()=>handleClick(student._id)}
        >
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Image</span>
                <img
                    src={student.img || "/default.png"}
                    className="h-[50px] w-[50px] object-contain"
                    alt={student.name || "Student"}
                />
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Id</span>
                {String(student.id)}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Name</span>
                {student.name}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Mobile</span>
                {student.mobileNumber}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Course</span>
                {student.courseNames}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Due</span>
                {student.dues}
            </td>
            <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">Options</span>
                <div className="flex gap-2">
                    <a
                        href={`https://web.whatsapp.com/send?phone=88${student.whatsAppNumber}&text=প্রিয় ${student.name} আইডি ${student.id} কোর্স ${student.courseNames} আপনার ফি ${student.dues} টাকা এখনো পরিশোধ হয়নি।%0Aঅনুগ্রহ করে পরিশোধ করার জন্য বিনীতভাবে অনুরোধ করা হচ্ছে ধন্যবাদ।%0Aশরীফ আর্ট স্কুল`}
                        target="_blank" rel="noopener noreferrer" className="bg-green-100 text-green-800 px-5 py-2  rounded-full hover:bg-green-200 border border-green-600 transition-colors duration-300">
                        Whatsapp
                    </a>
                </div>
            </td>
        </tr>
    );
};

export default ({ students }) => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/payment/add/${id}`);
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
                        <th className="bg-[#721c24] p-4 text-left text-white">Image</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Id</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Name</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Mobile</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Course</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Due</th>
                        <th className="bg-[#721c24] p-4 text-left text-white">Option</th>


                    </tr>
                </thead>
                {/* Table Body */}
                <tbody className="block md:table-row-group">
                    {students.map((student, index) => (
                        <StudentTableRow
                            student={student}
                            key={index}
                            handleClick={handleClick}
                        />
                    ))}
                </tbody>
            </table>

        </div>
    );
};
