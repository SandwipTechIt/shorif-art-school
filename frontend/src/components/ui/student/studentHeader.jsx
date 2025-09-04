import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getApi } from "../../../api";

export const StudentHeader = ({
  searchTerm,
  onSearchChange,
  status,
  onCourseChange,
  onTimeChange,
  selectedCourse,
  selectedTime,
}) => {
  const { data: courses, error, isLoading, isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getApi("getCourses"),
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const selectedCourseDetails = courses?.find(
    (course) => course.name === selectedCourse
  );

  return (
    <div className="studentHeader gap-2 items-center p-4 shadow-md dark:bg-gray-800 flex flex-col md:flex-row md:items-center md:justify-between w-full bg-white">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        {status} Students
      </h1>
      <div className="flex gap-2">
        <select
          value={selectedCourse}
          onChange={onCourseChange}
          className="w-full h-full max-w-[200px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Courses</option>
          {courses?.map((course) => (
            <option key={course._id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTime}
          onChange={onTimeChange}
          disabled={!selectedCourse}
          className="w-full h-full max-w-[200px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Times</option>
          {selectedCourseDetails?.time?.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by anything"
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full h-full max-w-[400px] rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );
};
