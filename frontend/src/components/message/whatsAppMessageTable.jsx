import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { formateDate } from "../../utiils/formateDate";
export default ({ students, message }) => {
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
              className="mb-4 block rounded-lg border border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-dark md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
            >

              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left dark:text-white">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Name
                </span>
                {student.name}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Father
                </span>
                {student.fatherName}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Mother
                </span>
                {student.motherName}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Course
                </span>
                {student.courseName}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Mobile
                </span>
                {student.mobileNumber}
              </td>
              <td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Admit Date
                </span>
                {formateDate(student.createdAt)}
              </td>
              {/* Options/Buttons Cell */}
              <td className="flex items-center justify-between p-2 text-right md:table-cell md:p-4 md:text-left">
                <span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
                  Options
                </span>
                <div className="flex flex-wrap gap-2">
                 <a 
                    // href={`https://web.whatsapp.com/send?phone=${student.mobileNumber}&text=${message}`}
                    href={`https://web.whatsapp.com/send?phone=88${student.whatsAppNumber}&text=${message}`}
                    target="_blank"
                    className="cursor-pointer rounded-full bg-sky-100 py-1.5 px-3 text-sm font-medium capitalize text-sky-800 transition hover:bg-sky-200"
                  >
                    Message
                  </a>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
