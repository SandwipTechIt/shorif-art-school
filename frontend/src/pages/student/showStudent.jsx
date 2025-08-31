import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getApi, deleteApi } from "../../api";
import { ErrorMessage } from "../../components/ui/errorMessage";
import { LoadingSpinner } from "../../components/ui/loader";
import { useState, useEffect } from "react";
import { formateDate } from "../../utiils/formateDate";
const ConfirmDeleteModal = ({ onCancel, onConfirm }) => {
  useEffect(() => {
    // Store original body overflow value
    const originalOverflow = document.body.style.overflow;
    // Prevent scrolling on body
    document.body.style.overflow = "hidden";
    // Cleanup function to restore scrolling when modal closes
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  const handleOutsideClick = (e) => {
    // Check if the click is directly on the backdrop (not on the modal content)
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50"
      onClick={handleOutsideClick}
    >
      <div
        className="rounded-lg bg-white p-6 shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from propagating
      >
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">Confirm Deletion</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this student? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ShowStudent = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getApi(`getStudent/${id}`),
    enabled: !!id,
  });

  const navigate = useNavigate();
  const handleCancelDelete = () => {
    setShowModal(false);
  };
  const handleConfirmDelete = async () => {
    try {
      await deleteApi(`deleteStudent/${id}`);
      navigate("/student/all");
    } catch (error) {
      alert("Error Deleting Student");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => queryClient.invalidateQueries(["student", id])}
      />
    );
  }


  return (
    <>
      <div className="min-h-screen py-4 px-2 sm:px-4 lg:px-6">
        <div className="mx-auto">
          <div className="bgGlass rounded-2xl shadow-xl overflow-hidden">
            {/* Header with profile */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center shadow-lg">
                    <img src={student.img} className="w-full h-full object-cover rounded-full" alt="" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {student.name}
                  </h1>
                  <div className="flex items-center justify-center sm:justify-start">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${student.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      <i
                        className={`fas fa-circle mr-2 text-xs ${student.status === "active"
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      ></i>
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to={`/student/edit/${id}`}
                  className="px-4 py-2 outline-0 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center"
                >
                  Edit Student
                </Link>
                <button
                  className="px-4 py-2 outline-0 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  Delete Student
                </button>
              </div>
            </div>

            {/* Student details */}
            <div className="p-2 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white/50 rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                    <i className="fas fa-id-card text-blue-600 mr-2"></i>
                    Personal Information
                  </h2>

                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Full Name
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {student.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-male text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Father's Name
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {student.fatherName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-female text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Mother's Name
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {student.motherName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-calendar-alt text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Date of Birth
                        </p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {formateDate(student.dob)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-venus-mars text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Gender
                        </p>
                        <p className="font-medium text-gray-800 capitalize dark:text-white">
                          {student.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <i className="fas fa-venus-mars text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-white">
                          Admission Fee
                        </p>
                        <p className="font-medium text-gray-800 capitalize dark:text-white">
                          {student.admissionFee || 0} TK
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic & Contact Information */}
                <div className="space-y-8">
                  {/* Academic Information */}
                  <div className="bg-white/50 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                      <i className="fas fa-graduation-cap text-blue-600 mr-2"></i>
                      Academic Information
                    </h2>

                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2  gap-2">

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-id-card text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            ID
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-school text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            School
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.schoolName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-briefcase text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Profession
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.profession}
                          </p>
                        </div>
                      </div>


                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-book text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Course
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.enrollments?.map(e => e.courseName).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-money-bill-1 text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Fee
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.enrollments?.reduce((total, enrollment) => total + Number(enrollment.fee), 0)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-book text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Admit Date
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {formateDate(student.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white/50 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                      <i className="fas fa-address-book text-blue-600 mr-2"></i>
                      Contact Information
                    </h2>

                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-map-marker-alt text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Address
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fas fa-phone text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            Mobile Number
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.mobileNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <i className="fab fa-whatsapp text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-white">
                            WhatsApp Number
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.whatsAppNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-md">
                <p>
                  Last updated:{" "}
                  {formateDate(student.updatedAt || student.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ConfirmDeleteModal
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default ShowStudent;
