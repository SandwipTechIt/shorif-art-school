import React from "react";

const Input = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  name,
  error,
  disabled = false,
  icon: Icon,
  className = "",
}) => {
  const baseClasses =
    "w-full px-4 py-2 text-gray-900 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  const stateClasses = disabled
    ? "border-gray-300 bg-gray-200 cursor-not-allowed"
    : error
    ? "border-red-500 focus:ring-red-400"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  const iconPadding = Icon ? "pl-10" : "px-4";

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses} ${iconPadding}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
