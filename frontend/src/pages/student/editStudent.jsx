/* File: src/pages/AddStudent.js */
import React, { useState, useEffect, useRef } from "react";
import { getApi, putApi } from "../../api";
import { LoadingSpinner } from "../../components/ui/loader";
import { ErrorMessage } from "../../components/ui/errorMessage";
import { useParams } from "react-router";

/* File: src/components/form/Input.js */
import { forwardRef } from "react";

const Input = forwardRef(({ label, icon, error, ...rest }, ref) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-200">
        <i className={icon}></i>
      </span>
      <input
        ref={ref}
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        {...rest}
      />
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
));

/* File: src/components/form/Select.js */
const Select = forwardRef(({ label, icon, options, error, ...rest }, ref) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <i className={icon}></i>
      </span>
      <select
        ref={ref}
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
));

function formatDateToDDMMYYYY(isoDateString) {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export default function AddStudent() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: "",
    profession: "",
    gender: "",
    schoolName: "",
    address: "",
    mobileNumber: "",
    whatsAppNumber: "",
    courseId: "",
    status: "",
  });

  const inputRefs = useRef([]);

  // Fetch courses and student data in parallel
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [coursesData, studentData] = await Promise.all([
          getApi("getCourses"),
          getApi(`getStudent/${id}`),
        ]);

        setCourses(coursesData);

        setForm({
          name: studentData.name || "",
          fatherName: studentData.fatherName || "",
          motherName: studentData.motherName || "",
          dob: formatDateToDDMMYYYY(studentData.dob) || "",
          profession: studentData.profession || "",
          gender: studentData.gender || "",
          schoolName: studentData.schoolName || "",
          address: studentData.address || "",
          mobileNumber: studentData.mobileNumber || "",
          whatsAppNumber: studentData.whatsAppNumber || "",
          courseId: studentData.courseId?._id || "",
          status: studentData.status || "",
        });

        setErrors({ global: "" });
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors({ global: "Unable to load data. Please try again." });
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.fatherName) newErrors.fatherName = "Father's name is required";
    if (!form.motherName) newErrors.motherName = "Mother's name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10,15}$/.test(form.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid number";
    }
    if (!form.courseId) newErrors.courseId = "Please select a course";
    if (!form.dob || !/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob)) {
      newErrors.dob = "Enter date as DD/MM/YYYY";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerMsg("");

    // Convert DD/MM/YYYY to ISO format
    const [day, month, year] = form.dob.split("/");
    const payload = { ...form, dob: `${year}-${month}-${day}` };

    try {
      await putApi(`updateStudent/${id}`, payload);
      setServerMsg("Student updated successfully!");
    } catch (err) {
      setServerMsg(
        err.response?.data?.message ||
          "An error occurred while updating the student."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) next.focus();
      else handleSubmit(e);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (errors.global) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <ErrorMessage
          error={{ message: errors.global }}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bgGlass dark:bg-gray-800 shadow-xl rounded-lg w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-white">
          Edit Student
        </h1>

        {serverMsg && (
          <div
            className={`mb-4 p-3 rounded text-sm font-medium ${
              serverMsg.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {serverMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Personal Information Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Input
              ref={(el) => (inputRefs.current[0] = el)}
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown(0)}
              error={errors.name}
              icon="fas fa-user"
            />
            <Input
              ref={(el) => (inputRefs.current[1] = el)}
              label="Father's Name"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              onKeyDown={handleKeyDown(1)}
              error={errors.fatherName}
              icon="fas fa-male"
            />
            <Input
              ref={(el) => (inputRefs.current[2] = el)}
              label="Mother's Name"
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              onKeyDown={handleKeyDown(2)}
              error={errors.motherName}
              icon="fas fa-female"
            />
            <Input
              ref={(el) => (inputRefs.current[3] = el)}
              label="Date of Birth"
              name="dob"
              placeholder="DD/MM/YYYY"
              value={form.dob}
              onChange={handleChange}
              onKeyDown={handleKeyDown(3)}
              error={errors.dob}
              icon="fas fa-calendar-alt"
            />
            <Input
              ref={(el) => (inputRefs.current[4] = el)}
              label="Profession / Occupation"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              onKeyDown={handleKeyDown(4)}
              icon="fas fa-briefcase"
            />
            <Select
              ref={(el) => (inputRefs.current[5] = el)}
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              onKeyDown={handleKeyDown(5)}
              options={[
                { label: "Select Gender", value: "" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              error={errors.gender}
              icon="fas fa-venus-mars"
            />
          </div>

          {/* Education & Course Section */}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Input
              ref={(el) => (inputRefs.current[6] = el)}
              label="School / College Name"
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              onKeyDown={handleKeyDown(6)}
              icon="fas fa-school"
            />
            <Select
              ref={(el) => (inputRefs.current[7] = el)}
              label="Course"
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              onKeyDown={handleKeyDown(7)}
              options={[
                { label: "Select Course", value: "" },
                ...courses.map((c) => ({ label: c.name, value: c._id })),
              ]}
              error={errors.courseId}
              icon="fas fa-graduation-cap"
            />
          </div>

          {/* Contact & Status Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Input
              ref={(el) => (inputRefs.current[8] = el)}
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              onKeyDown={handleKeyDown(8)}
              icon="fas fa-map-marker-alt"
            />
            <Select
              ref={(el) => (inputRefs.current[9] = el)}
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              onKeyDown={handleKeyDown(9)}
              options={[
                { label: "Select Status", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Completed", value: "completed" },
              ]}
              error={errors.status}
              icon="fas fa-info-circle"
            />
            <Input
              ref={(el) => (inputRefs.current[10] = el)}
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              onKeyDown={handleKeyDown(10)}
              error={errors.mobileNumber}
              icon="fas fa-phone-alt"
            />
            <Input
              ref={(el) => (inputRefs.current[11] = el)}
              label="WhatsApp Number"
              name="whatsAppNumber"
              value={form.whatsAppNumber}
              onChange={handleChange}
              onKeyDown={handleKeyDown(11)}
              icon="fab fa-whatsapp"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-md mx-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <i className="fas fa-spinner animate-spin mr-2"></i>
            ) : (
              "Update Student"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
