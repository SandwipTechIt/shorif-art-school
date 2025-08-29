import { useState } from "react";
import CourseForm from "../../components/course/courseForm";
import { postApi } from "../../api";
import { toast } from "react-toastify";

export default () => {
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleSubmit = async (data) => {
    try {
      await postApi("createCourse", data);
      toast.success("Course created successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "md:text-base text-sm",
        bodyClassName: "md:text-base text-sm",
      });
      // Reset the form after successful creation
      setResetTrigger(prev => !prev);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to create course. Please try again.", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <CourseForm onSubmit={handleSubmit} resetTrigger={resetTrigger} />
  );
};