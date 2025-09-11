import React from "react";
import { Link } from "react-router";

const Widget = ({ 
  totalStudents, 
  totalCourses, 
  totalPaidAmount, 
  currentMonthDue, 
  courseEnrollmentCounts, 
  courseBatchEnrollmentCounts 
}) => {

  const mainWidgets = [
    {
      type: "totalStudents",
      title: "Total Students",
      value: totalStudents,
      to: "student/active",
      link: "See all students",
      icon: "fa-user-graduate",
      bgColor: "bg-blue-600",
      iconColor: "text-blue-600",
    },
    {
      type: "totalCourses",
      title: "Total Courses",
      value: totalCourses,
      to: "course/all",
      link: "View all courses",
      icon: "fa-book",
      bgColor: "bg-green-600",
      iconColor: "text-green-600",
    },
    {
      type: "totalPaidAmount",
      title: "Total Paid Amount",
      value: `৳${totalPaidAmount?.toLocaleString() || 0}`,
      to: "payment/all",
      link: "View all payments",
      icon: "fas fa-dollar-sign",
      bgColor: "bg-purple-600",
      iconColor: "text-purple-600",
    },
    {
      type: "currentMonthDue",
      title: "Current Month Due",
      value: `৳${currentMonthDue?.toLocaleString() || 0}`,
      to: "payment/due",
      link: "View due payments",
      icon: "fas fa-exclamation-triangle",
      bgColor: "bg-red-600",
      iconColor: "text-red-600",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {mainWidgets.map((widget) => (
          <div
            key={widget.type}
            className={`${widget.bgColor} flex justify-between p-4 shadow-md rounded-xl text-white`}
          >
            <div className="flex flex-col justify-between">
              <span className="font-bold text-lg">{widget.title}</span>
              <span className="text-3xl font-extrabold">{widget.value}</span>
              <Link
                to={`/${widget.to}`}
                className="w-max text-sm border-b border-white hover:border-opacity-70 transition-all"
              >
                {widget.link}
              </Link>
            </div>
            <div
              className={`text-3xl p-2 rounded-lg self-end bg-white bg-opacity-50 ${widget.iconColor}`}
            >
              <i className={`fas ${widget.icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Course Enrollment Counts Widgets */}
      {courseEnrollmentCounts && courseEnrollmentCounts.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Course Enrollments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseEnrollmentCounts.map((course, index) => (
              <div
                key={`course-${index}`}
                className="bg-indigo-600 flex justify-between p-4 shadow-md rounded-xl text-white"
              >
                <div className="flex flex-col justify-between">
                  <span className="font-bold text-lg">{course.courseName}</span>
                  <span className="text-3xl font-extrabold">{course.studentCount}</span>
                  <Link
                    to="/course/all"
                    className="w-max text-sm border-b border-white hover:border-opacity-70 transition-all"
                  >
                    View course details
                  </Link>
                </div>
                <div className="text-3xl p-2 rounded-lg self-end bg-white bg-opacity-50 text-indigo-600">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Batch Enrollment Counts Widgets */}
      {courseBatchEnrollmentCounts && courseBatchEnrollmentCounts.length > 0 && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Course Batch Enrollments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courseBatchEnrollmentCounts.map((batch, index) => (
              <div
                key={`batch-${index}`}
                className="bg-teal-600 flex justify-between p-4 shadow-md rounded-xl text-white"
              >
                <div className="flex flex-col justify-between">
                  <span className="font-bold text-lg">{batch.courseName}</span>
                  <span className="text-sm opacity-90">{batch.courseTime}</span>
                  <span className="text-2xl font-extrabold">{batch.studentCount} students</span>
                  <Link
                    to="/course/all"
                    className="w-max text-sm border-b border-white hover:border-opacity-70 transition-all"
                  >
                    View batch details
                  </Link>
                </div>
                <div className="text-3xl p-2 rounded-lg self-end bg-white bg-opacity-50 text-teal-600">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Widget;
