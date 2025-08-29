/* File: src/pages/EditStudent.js */
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

import { getApi, postApi } from "../../api";
import Loader from "../../components/ui/loader";
import { ErrorMessage } from "../../components/ui/errorMessage";
import { MultiSelect } from "../../components/ui/multiselect";
import { useParams } from "react-router";
import "react-datepicker/dist/react-datepicker.css";

const Input = ({ label, icon, error, placeholder, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-200">
        <i className={icon}></i>
      </span>
      <input
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-[#00c2ff80] focus:ring-[#00c2ff80]"
        }`}
        {...rest}
      />
    </div>
  </div>
);

const Select = ({ label, icon, options, error, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <i className={icon}></i>
      </span>
      <select
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white ${
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-[#00c2ff80] focus:ring-[#00c2ff80]"
        } ${rest.disabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="dark:text-white dark:bg-gray-800">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const ImageInput = ({ label, onChange, preview, onRemove, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`w-full flex items-center justify-center px-4 py-8 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
            error
              ? "border-red-500 hover:border-red-400"
              : "border-[#00c2ff80] hover:border-[#00c2ff]"
          }`}
        >
          <div className="text-center">
            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click to upload or change student photo
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </label>
      </div>
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Student preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function EditStudent() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: courses, error: coursesError, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getApi("getCourses"),
  });

  const { data: studentData, error: studentError, isLoading: studentLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getApi(`getStudent/${id}`),
    enabled: !!id, // Only fetch if id is available
  });

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dob: null,
    profession: "",
    gender: "",
    schoolName: "",
    address: "",
    mobileNumber: "",
    whatsAppNumber: "",
    courses: [],
    courseTimes: {},
    admissionFee: "",
    status: "",
    image: null, // Holds the new image file
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentData) {
      setForm({
        name: studentData.name || "",
        fatherName: studentData.fatherName || "",
        motherName: studentData.motherName || "",
        dob: studentData.dob ? new Date(studentData.dob) : null,
        profession: studentData.profession || "",
        gender: studentData.gender || "",
        schoolName: studentData.schoolName || "",
        address: studentData.address || "",
        mobileNumber: studentData.mobileNumber || "",
        whatsAppNumber: studentData.whatsAppNumber || "",
        courses: studentData.courses || [],
        courseTimes: studentData.courseTimes || {},
        admissionFee: studentData.admissionFee || "",
        status: studentData.status || "",
        image: null,
      });
      if (studentData.img) {
        setImagePreview(studentData.img);
      }
    }
  }, [studentData]);

  const selectedCourses = courses?.filter((course) => form.courses.includes(course._id)) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCourseSelection = (selectedCourseIds) => {
    const newCourseTimes = { ...form.courseTimes };
    Object.keys(newCourseTimes).forEach((courseId) => {
      if (!selectedCourseIds.includes(courseId)) {
        delete newCourseTimes[courseId];
      }
    });
    setForm((prev) => ({ ...prev, courses: selectedCourseIds, courseTimes: newCourseTimes }));
    setErrors((prev) => ({ ...prev, courses: "", courseTimes: "" }));
  };

  const handleTimeSelection = (courseId, timeSlot) => {
    setForm((prev) => ({ ...prev, courseTimes: { ...prev.courseTimes, [courseId]: timeSlot } }));
    setErrors((prev) => ({ ...prev, courseTimes: "" }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, dob: date }));
    setErrors((prev) => ({ ...prev, dob: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setImageRemoved(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.fatherName) newErrors.fatherName = "Father's name is required";
    if (!form.motherName) newErrors.motherName = "Mother's name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10,15}$/.test(form.mobileNumber)) newErrors.mobileNumber = "Enter a valid number";
    if (!form.courses || form.courses.length === 0) newErrors.courses = "Please select at least one course";
    const missingTimeSlots = form.courses.filter((courseId) => !form.courseTimes[courseId]);
    if (missingTimeSlots.length > 0) newErrors.courseTimes = "Please select time slots for all selected courses";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key === "dob" && form.dob) {
        formData.append(key, form.dob.toISOString().split("T")[0]);
      } else if (key === "courses" || key === "courseTimes") {
        formData.append(key, JSON.stringify(form[key]));
      } else if (key !== "image") {
        formData.append(key, form[key]);
      }
    });

    if (form.image) {
      formData.append("image", form.image);
    } else if (imageRemoved) {
      formData.append("removeImage", "true");
    }

    try {
      await postApi(`updateStudent/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries(["student", id]);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (coursesLoading || studentLoading) return <Loader />;
  if (coursesError || studentError) return <ErrorMessage error={coursesError || studentError} />;

  return (
    <div className="flex flex-col items-center md:py-10 md:px-4">
      <div className="bgGlass shadow-xl rounded-lg w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-white">
          <i className="fas fa-user-edit mr-2 text-blue-600" /> Edit Student
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              icon="fas fa-user"
              placeholder="Enter full name"
            />
            <Input
              label="Father's Name"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
              error={errors.fatherName}
              icon="fas fa-male"
              placeholder="Enter father's name"
            />
            <Input
              label="Mother's Name"
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
              error={errors.motherName}
              icon="fas fa-female"
              placeholder="Enter mother's name"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Date of Birth
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-200 z-10">
                  <i className="fas fa-calendar-alt"></i>
                </span>
                <DatePicker
                  selected={form.dob}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white h-[42px] ${
                    errors.dob ? "border-red-500 focus:ring-red-400" : "border-[#00c2ff80] focus:ring-[#00c2ff80]"
                  }`}
                  wrapperClassName="w-full"
                />
              </div>
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>
            <Input
              label="Profession / Occupation"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              icon="fas fa-briefcase"
              placeholder="Enter profession"
            />
            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { label: "Select Gender", value: "" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              error={errors.gender}
              icon="fas fa-venus-mars"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <Input
              label="School / College Name"
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              icon="fas fa-school"
              placeholder="Enter school name"
            />
            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              icon="fas fa-map-marker-alt"
              placeholder="Enter address"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              icon="fas fa-phone-alt"
              placeholder="Enter mobile number"
            />
            <Input
              label="WhatsApp Number"
              name="whatsAppNumber"
              value={form.whatsAppNumber}
              onChange={handleChange}
              icon="fab fa-whatsapp"
              placeholder="Enter whatsapp number"
            />
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                <i className="fas fa-graduation-cap mr-2"></i>
                Select Courses
              </label>
              <MultiSelect
                options={courses?.map((c) => ({ label: c.name, value: c._id })) || []}
                selectedOptions={form.courses}
                onSelectionChange={handleCourseSelection}
              />
              {errors.courses && <p className="text-red-500 text-sm mt-1">{errors.courses}</p>}
            </div>
            <div className="grid md:grid-cols-1 gap-6">
              <Input
                label="Admission Fee"
                name="admissionFee"
                value={form.admissionFee}
                onChange={handleChange}
                icon="fas fa-money-bill-alt"
                placeholder="Enter admission fee"
              />
              <Select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={[
                  { label: "Select Status", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Completed", value: "completed" },
                ]}
                error={errors.status}
                icon="fas fa-info-circle"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              {selectedCourses.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                    <i className="fas fa-clock mr-2"></i>
                    Select Time Slots
                  </label>
                  <div className="space-y-4">
                    {selectedCourses.map((course) => (
                      <div key={course._id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-600">
                        <h4 className="font-medium text-gray-800 mb-2 dark:text-white">
                          {course.name}
                        </h4>
                        <Select
                          label=""
                          name={`time-${course._id}`}
                          value={form.courseTimes[course._id] || ""}
                          onChange={(e) => handleTimeSelection(course._id, e.target.value)}
                          options={[
                            { label: "Select Time Slot", value: "" },
                            ...course.time.map((timeSlot) => ({ label: timeSlot, value: timeSlot })),
                          ]}
                          icon="fas fa-clock"
                        />
                      </div>
                    ))}
                  </div>
                  {errors.courseTimes && <p className="text-red-500 text-sm mt-1">{errors.courseTimes}</p>}
                </div>
              )}
            </div>
            <ImageInput
              label="Student Photo"
              onChange={handleImageChange}
              preview={imagePreview}
              onRemove={removeImage}
              error={errors.image}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-md mx-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? <i className="fas fa-spinner animate-spin"></i> : "Update Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
