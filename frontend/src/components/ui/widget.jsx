import React from "react";
import { Link } from "react-router";

const Widget = ({ students, courses, discount, paidAmount }) => {

  const widgets = [
    {
      type: "students",
      title: "Students",
      to: "student/active",
      link: "See all students",
      icon: "fa-user-graduate",
      bgColor: "bg-blue-600",
      iconColor: "text-blue-600",
    },
    {
      type: "courses",
      title: "Courses",
      to: "course/all",
      link: "View all courses",
      icon: "fa-book",
      bgColor: "bg-green-600",
      iconColor: "text-green-600",
    },
    {
      type: "paidAmount",
      title: "Paid Amount",
      to: "payment/all",
      link: "View all payment",
      icon: "fas fa-dollar-sign",
      bgColor: "bg-red-600",
      iconColor: "text-red-600",
    },
    {
      type: "discount",
      title: "Discount",
      to: "payment/all",
      link: "View all payment",
      icon: "fa-credit-card",
      bgColor: "bg-yellow-500",
      iconColor: "text-yellow-500",
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
              {widget.type === "students" ? students : widget.type === "courses" ? courses : widget.type === "discount" ? discount : widget.type === "paidAmount" ? paidAmount : ""}
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
