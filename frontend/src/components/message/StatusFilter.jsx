// components/StatusFilter.jsx
import React from "react";

const StatusFilter = ({ status, setStatus }) => {
  const statusOptions = [
    { key: "active", label: "Active", color: "bg-green-500 hover:bg-green-600" },
    { key: "inactive", label: "Inactive", color: "bg-red-500 hover:bg-red-600" },
    { key: "completed", label: "Completed", color: "bg-blue-500 hover:bg-blue-600" },
  ];

  return (
    <div className="flex space-x-2 mb-4">
      {statusOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => setStatus(option.key)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition duration-200 ${
            status === option.key ? option.color : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;