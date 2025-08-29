import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { ErrorMessage } from '../../components/ui/errorMessage';
import { LoadingSpinner } from '../../components/ui/loader';
import { formateDate } from '../../utiils/formateDate';

import { getApi, deleteApi } from '../../api';

import Popup from '../../components/ui/popup';
import Header from '../../components/ui/header';

const deleteCourse = async (id) => {
  try {
    await deleteApi(`deleteCourse/${id}`);
  } catch (error) {
    throw error;
  }
};

// Course Card Component
const CourseCard = ({ course, onDelete, isDeleting }) => {

  return (
    <div className="bgGlass rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h2>
        <p className="font-medium mb-1"> <span className='w-28 inline-block'>Fee</span> <span className='text-brand-500'>৳{course.fee}</span> </p>
        <p className="font-medium mb-1"> <span className='w-28  inline-block'>Created at</span> <span className='text-brand-500'>: {formateDate(course.createdAt)}</span> </p>
        <p className="font-medium mb-1"> <span className='w-28  inline-block'>Last Update</span><span className='text-brand-500'> : {formateDate(course.updatedAt)}</span> </p>
      </div>


      <div className="mb-6 mt-3">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
          Batch Time Slots
        </h3>
        <div className="flex flex-wrap gap-2">
          {course.time.map((time, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 border-1 border-blue-600 text-blue-600 rounded-full text-sm font-medium"
            >
              {time}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          to={`/course/edit/${course._id}`}
          className="px-4 py-2 bg-[#218358] text-white rounded-lg font-semibold hover:bg-[#0f5e3b] hover:text-white flex items-center gap-2 transition focus:outline-none "
          aria-label={`Edit ${course.name}`}
        >
          <i className="fas fa-pencil-alt"></i> Edit
        </Link>
        <button
          onClick={() => onDelete(course._id)}
          disabled={isDeleting}
          className={`px-4 py-2 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-red-400 ${isDeleting
            ? 'bg-red-300 cursor-not-allowed text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          aria-label={`Delete ${course.name}`}
        >
          {isDeleting ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <i className="fas fa-trash-alt"></i>
          )}
          Delete
        </button>
      </div>
    </div>
  );
};


// No Courses Component
const NoCourses = () => (
  <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-md mx-auto">
    <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Courses Found</h3>
    <p className="text-gray-600 mb-6">Get started by creating a new course.</p>
    <Link
      to="/course/add"
      className="inline-flex items-center gap-2 bg-brand-500 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
    >
      <i className="fas fa-plus"></i> Add Course
    </Link>
  </div>
);





// Main Component
const ShowAllCourses = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getApi('getCourses'),
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success("Course deleted successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete course. Please try again.", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleDelete = (id) => {
    setCourseToDelete(id);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete);
      setShowDeletePopup(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setCourseToDelete(null);
  };

  return (
    <div className="min-h-screen bg-white/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header title="All Courses" linkTo="/course/add" linkText="Add New Course" />
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorMessage
            error={error}
            onRetry={() => queryClient.invalidateQueries(['courses'])}
          />
        ) : courses?.length === 0 ? (
          <NoCourses />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === course._id}
              />
            ))}
          </div>
        )}
      </div>

      {showDeletePopup && (
        <Popup
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          item="course"
        />
      )}
    </div>
  );
};

export default ShowAllCourses;