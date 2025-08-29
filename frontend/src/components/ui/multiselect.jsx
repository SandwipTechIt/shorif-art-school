import React, { useState, useRef, useEffect } from "react";

export const MultiSelect = ({ options, selectedOptions, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownUpward, setIsDropdownUpward] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine dropdown direction
  useEffect(() => {
    if (isOpen) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      // Assume a dropdown height of 200px for calculation
      const dropdownHeight = 200;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setIsDropdownUpward(true);
      } else {
        setIsDropdownUpward(false);
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.includes(option.value);
    let newSelection;

    if (isSelected) {
      newSelection = selectedOptions.filter((item) => item !== option.value);
    } else {
      newSelection = [...selectedOptions, option.value];
    }
    onSelectionChange(newSelection);
  };

  const handleRemoveTag = (e, optionValue) => {
    e.stopPropagation(); // Prevents the dropdown from toggling
    const newSelection = selectedOptions.filter((item) => item !== optionValue);
    onSelectionChange(newSelection);
  };

  const renderTags = () => {
    const selectedLabels = options
      .filter((option) => selectedOptions.includes(option.value))
      .map((option) => option.label);

    if (selectedLabels.length === 0) {
      return <span className="text-gray-500">Select...</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {selectedLabels.map((label, index) => (
          <span
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {label}
            <i
              className="fa-solid fa-xmark text-xs ml-2 cursor-pointer"
              onClick={(e) =>
                handleRemoveTag(
                  e,
                  options.find((opt) => opt.label === label).value
                )
              }
            ></i>
          </span>
        ))}
      </div>
    );
  };

  const dropdownClasses = `absolute w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto ${
    isDropdownUpward ? "bottom-full mb-1" : "top-full mt-1"
  } custom-scrollbar`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between border border-primary rounded-md p-2 cursor-pointer bg- shadow-sm hover:border-blue-500 transition-colors"
        onClick={handleToggle}
      >
        {renderTags()}
        <i
          className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-300 ${
            isOpen ? (isDropdownUpward ? "rotate-0" : "rotate-180") : "rotate-0"
          }`}
        ></i>
      </div>
      {isOpen && (
        <div className={dropdownClasses}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between ${
                selectedOptions.includes(option.value) ? "bg-blue-50" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <span>{option.label}</span>
              {selectedOptions.includes(option.value) && (
                <i className="fa-solid fa-check text-blue-500"></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// const App = () => {
//   const [selectedValues, setSelectedValues] = useState([]);

//   const options = [
//     { value: "xxxx", label: "Apple" },
//     { value: "banana", label: "Banana" },
//     { value: "cherry", label: "Cherry" },
//     { value: "grape", label: "Grape" },
//     { value: "orange", label: "Orange" },
//     { value: "strawberry", label: "Strawberry" },
//   ];

//   const handleSelectionChange = (newSelection) => {
//     setSelectedValues(newSelection);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
//           Custom Multi-Select Component
//         </h1>
//         <MultiSelect
//           options={options}
//           selectedOptions={selectedValues}
//           onSelectionChange={handleSelectionChange}
//         />
//         <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
//           <p className="font-semibold">Selected values:</p>
//           <pre className="mt-1 whitespace-pre-wrap">
//             {JSON.stringify(selectedValues, null, 2)}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
