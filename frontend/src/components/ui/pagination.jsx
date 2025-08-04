import React from "react";

export const Pagination = ({ pagination, onPageChange }) => {
  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {/* Previous Button */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-200 shadow-sm hover:bg-gray-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={pagination.currentPage === 1}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {Array.from(
          { length: Math.min(5, pagination.totalPages) },
          (_, index) => {
            let pageNumber;
            if (pagination.totalPages <= 5) {
              pageNumber = index + 1;
            } else if (pagination.currentPage <= 3) {
              pageNumber = index + 1;
            } else if (pagination.currentPage >= pagination.totalPages - 2) {
              pageNumber = pagination.totalPages - 4 + index;
            } else {
              pageNumber = pagination.currentPage - 2 + index;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-lg transition-all duration-200 shadow-sm ${
                  pagination.currentPage === pageNumber
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md"
                    : "bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 hover:shadow-md"
                }`}
                aria-label={`Page ${pageNumber}`}
                aria-current={
                  pagination.currentPage === pageNumber ? "page" : undefined
                }
              >
                {pageNumber}
              </button>
            );
          }
        )}
      </div>

      {/* Next Button */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 transition-all duration-200 shadow-sm hover:bg-gray-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={pagination.currentPage === pagination.totalPages}
        aria-label="Next page"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};
