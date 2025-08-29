import React from "react";
import { ErrorMessage } from "../ui/errorMessage";

const StudentSearch = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  errors,
  onSearch,
  onSelectStudent
}) => {
  return (
    <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">Search Student</h2>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, mobile number, father's name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg  transition-colors dark:text-white dark:border-white focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <button
          onClick={onSearch}
          disabled={searchLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {searchLoading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </button>
      </div>

      {errors.search && 
          <div
            className={`mb-4 p-3 rounded text-sm font-medium bg-red-100 text-red-700`}
          >
            {errors.search}
          </div>
        }
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search Results</h3>
          {searchResults.map((student) => (
            <div
              key={student._id}
              onClick={() => onSelectStudent(student)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                  <p className="text-gray-600 dark:text-white">Father: {student.fatherName}</p>
                  <p className="text-gray-600 dark:text-white">Mobile: {student.mobileNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-white">Course: {student.courseId?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-white">Fee: ৳{student.courseId?.fee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
