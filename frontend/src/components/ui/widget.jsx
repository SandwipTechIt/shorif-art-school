import React, { useEffect, useState } from "react";
import { Link } from "react-router";
// import { getTotalCounts } from "../../Api";

// Add this to your HTML head:
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

const Widget = () => {
  const defaultTotalCounts = {
    totalStudents: 1000,
    totalCourses: 1000,
    totalOrders: 1000,
    totalAdmins: 1000,
  };

  const [totalCounts, setTotalCounts] = useState(defaultTotalCounts);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await getTotalCounts();
  //       if (response) {
  //         setTotalCounts(response);
  //       }
  //     } catch (apiError) {
  //       console.error("Error fetching total counts:", apiError);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const widgets = [
    {
      type: "totalStudents",
      title: "Students",
      to: "students",
      link: "See all students",
      icon: "fa-user-graduate",
      bgColor: "bg-blue-600",
      iconColor: "text-blue-600",
    },
    {
      type: "totalCourses",
      title: "Courses",
      to: "course/all",
      link: "View all courses",
      icon: "fa-book",
      bgColor: "bg-green-600",
      iconColor: "text-green-600",
    },
    {
      type: "totalOrders",
      title: "Orders",
      to: "orders",
      link: "View all orders",
      icon: "fa-credit-card",
      bgColor: "bg-yellow-500",
      iconColor: "text-yellow-500",
    },
    {
      type: "totalAdmins",
      title: "Admins",
      to: "admins",
      link: "View all admins",
      icon: "fa-user-shield",
      bgColor: "bg-red-600",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
      {widgets.map((widget) => (
        <div
          key={widget.type}
          className={`${widget.bgColor} flex justify-between p-4 shadow-md rounded-xl text-white`}
        >
          <div className="flex flex-col justify-between">
            <span className="font-bold text-lg">{widget.title}</span>
            <span className="text-3xl font-extrabold">
              {totalCounts[widget.type]}
            </span>
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
  );
};

export default Widget;
