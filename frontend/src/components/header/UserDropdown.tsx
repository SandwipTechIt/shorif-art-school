import { useNavigate } from "react-router";

export default function UserDropdown() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    // Perform some logic
    navigate("/profile"); // Navigate to the dashboard route
  };

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        className="flex items-center justify-center transition-colors text-gray-700 dropdown-toggle dark:text-gray-400 h-11 w-11 rounded-full border-2 border-gray-200 dark:border-gray-800"
      >
        <i className="fa-solid fa-circle-user text-2xl"></i>
      </button>
    </div>
  );
}
