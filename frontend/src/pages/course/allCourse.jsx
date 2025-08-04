import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';
import { getApi, deleteApi } from '../../api';
import { ErrorMessage } from '../../components/ui/errorMessage';
import { LoadingSpinner } from '../../components/ui/loader';
// Delete course function
const deleteCourse = async (id) => {
  try {
    await deleteApi(`deleteCourse/${id}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Course Card Component
const CourseCard = ({ course, onDelete, isDeleting }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bgGlass rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.name}</h2>
        <p className="text-brand-500 font-semibold mb-1">Time: {course.time}</p>
        <p className="text-brand-500 font-medium mb-1">{`Fee: ৳ ${course.fee}`}</p>
        <p className="text-gray-600 dark:text-gray-200 text-sm">{`Created at: ${formatDate(course.createdAt)}`}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Link
          to={`/course/edit/${course._id}`}
          className="px-4 py-2 bg-[#e5f5ea] text-[#218358] rounded-lg font-semibold hover:bg-[#218358] hover:text-white flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={`Edit ${course.name}`}
        >
          <i className="fas fa-pencil-alt"></i> Edit
        </Link>
        <button
          onClick={() => onDelete(course._id)}
          disabled={isDeleting}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition focus:outline-none focus:ring-2 focus:ring-red-400 ${
            isDeleting
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

// Delete Error Alert Component
const DeleteErrorAlert = ({ message }) => (
  <div className="mb-6 p-5 bg-red-100 text-red-800 rounded-lg flex items-center gap-3 border border-red-300 shadow-sm">
    <i className="fas fa-exclamation-triangle text-xl"></i>
    <span className="font-semibold">{message}</span>
  </div>
);

// Header Component
const Header = () => (
  <div className="flex justify-between items-center mb-10">
    <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">All Courses</h1>
    <Link
      to="/course/add"
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none text-white font-semibold px-5 py-3 rounded-lg shadow-md transition"
    >
      <i className="fas fa-plus"></i> Add New Course
    </Link>
  </div>
);

// Main Component
const ShowAllCourses = () => {
  const [deleteError, setDeleteError] = useState(null);
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
      setDeleteError(null);
    },
    onError: (err) => {
      setDeleteError(err.message);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        {deleteError && <DeleteErrorAlert message={deleteError} />}
        
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

export default ShowAllCourses;