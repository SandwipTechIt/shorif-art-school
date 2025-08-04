import React from "react";

export const StudentHeader = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <div className="studentHeader bg-white p-4 shadow-md dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        All Students
      </h1>
      <form onSubmit={onSearchSubmit} className="flex gap-2 h-10 items-center">
        <input
          type="text"
          placeholder="Search by name, number, father's and Mother's name..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full h-full max-w-[400px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-sky-400 text-white font-bold rounded-lg px-4 py-2 hover:bg-sky-500 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};
