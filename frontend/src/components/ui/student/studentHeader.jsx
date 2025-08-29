import React from "react";

export const StudentHeader = ({
  searchTerm,
  onSearchChange,
  status,
}) => {
  return (
    <div className="studentHeader gap-2  items-cente p-4 shadow-md dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between w-full bg-white">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        {status} Students
      </h1>
        <input
          type="text"
          placeholder="Search by anything"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full h-full max-w-[400px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
    </div>
  );
};
