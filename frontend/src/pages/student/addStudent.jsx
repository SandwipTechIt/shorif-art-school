/* File: src/pages/AddStudent.js */
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

import { getApi, postApi } from "../../api";
import Loader from "../../components/ui/loader";
import { ErrorMessage } from "../../components/ui/errorMessage";
import { MultiSelect } from "../../components/ui/multiselect";
import "react-datepicker/dist/react-datepicker.css";
import { useReactToPrint } from "react-to-print";
import { formateDate } from "../../utiils/formateDate";




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
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white ${error
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
        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white ${error
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

/* File: src/components/form/ImageInput.js */

const ImageInput = ({ label, onChange, preview, onRemove, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
      {label}
    </label>
    <div className="space-y-4">
      {/* File Input */}
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
          className={`w-full flex items-center justify-center px-4 py-8 border-2 border-dashed rounded-md cursor-pointer transition-colors ${error
            ? "border-red-500 hover:border-red-400"
            : "border-[#00c2ff80] hover:border-[#00c2ff]"
            }`}
        >
          <div className="text-center">
            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click to upload student photo
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </label>
      </div>

      {/* Image Preview */}
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


const Invoice = ({ student, courses, totalAmountPaid, invoiceID }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <p className="text-lg font-semibold">Student Payment Invoice</p>
        <p className="text-lg font-semibold">Date: <span className="font-normal">{formateDate(new Date())}</span></p>
      </div>
      <hr className="my-4" style={{ color: "black" }} />
      <div className="grid grid-cols-2 gap-4">
        <p className="font-semibold">Student Name: <span className="font-normal">{student?.name}</span></p>
        <p className="font-semibold">Invoice ID: <span className="font-normal uppercase">{invoiceID}</span></p>
        <p className="font-semibold">Student ID: <span className="font-normal">{student?.id}</span></p>
        <p className="font-semibold">Payment: <span className="font-normal">{totalAmountPaid}</span></p>
        <p className="font-semibold">Course: <span className="font-normal">{courses?.map((course) => course.courseName).join(", ")}</span></p>
        <p className="font-semibold">Remaining Due: <span className="font-normal">0</span></p>
      </div>
      <hr className="my-4" style={{ color: "black" }} />
      <div className="flex items-center justify-evenly">
        <div>
          <p className="text-center mt-2">__________________</p>
          <p className="text-center">Guardian Signature</p>
        </div>
        <div>
          <p className="text-center mt-2">__________________</p>
          <p className="text-center">Student Signature</p>
        </div>
      </div>
    </div>
  )
}


const MonthNames = [
  { label: "Select Month", value: "" },
  { label: "January", value: "0" },
  { label: "February", value: "1" },
  { label: "March", value: "2" },
  { label: "April", value: "3" },
  { label: "May", value: "4" },
  { label: "June", value: "5" },
  { label: "July", value: "6" },
  { label: "August", value: "7" },
  { label: "September", value: "8" },
  { label: "October", value: "9" },
  { label: "November", value: "10" },
  { label: "December", value: "11" }
];

export default function AddStudent() {


  const { data: courses, error, isLoading, isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getApi("getCourses"),
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })


  const [errors, setErrors] = useState({});
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
    month: "",
    admissionFee: "",
    image: null,
  });
  const [response, setResponse] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Get selected courses to show available time slots
  const selectedCourses = courses?.filter(course => form.courses.includes(course._id)) || [];



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCourseSelection = (selectedCourseIds) => {
    // Clean up time selections for deselected courses
    const newCourseTimes = { ...form.courseTimes };
    Object.keys(newCourseTimes).forEach(courseId => {
      if (!selectedCourseIds.includes(courseId)) {
        delete newCourseTimes[courseId];
      }
    });

    setForm((prev) => ({
      ...prev,
      courses: selectedCourseIds,
      courseTimes: newCourseTimes
    }));
    setErrors((prev) => ({ ...prev, courses: "", courseTimes: "" }));
  };

  const handleTimeSelection = (courseId, timeSlot) => {
    setForm((prev) => ({
      ...prev,
      courseTimes: {
        ...prev.courseTimes,
        [courseId]: timeSlot
      }
    }));
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

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.fatherName) newErrors.fatherName = "Father's name is required";
    if (!form.motherName) newErrors.motherName = "Mother's name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.month) newErrors.month = "Please select payment month";
    if (!form.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10,15}$/.test(form.mobileNumber))
      newErrors.mobileNumber = "Enter a valid number";
    if (!form.courses || form.courses.length === 0)
      newErrors.courses = "Please select at least one course";

    // Check if time slots are selected for all courses
    const missingTimeSlots = form.courses.filter(courseId => !form.courseTimes[courseId]);
    if (missingTimeSlots.length > 0)
      newErrors.courseTimes = "Please select time slots for all selected courses";

    if (!form.dob)
      newErrors.dob = "Date of birth is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    // Format date for backend
    // const formattedDate = form.dob ? form.dob.toISOString().split('T')[0] : '';

    // Create FormData for file upload
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'courses') {
        formData.append(key, JSON.stringify(form.courses));
      } else if (key === 'courseTimes') {
        formData.append(key, JSON.stringify(form.courseTimes));
      } else if (key === 'image' && form.image) {
        formData.append('image', form.image);
      } else if (key !== 'image') {
        formData.append(key, form[key]);
      }
    });

    try {
      const response = await postApi("createStudent", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(response.student);
      toast.success("Student added successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form after successful submission
      // setForm({
      //   name: "",
      //   fatherName: "",
      //   motherName: "",
      //   dob: null,
      //   profession: "",
      //   gender: "",
      //   schoolName: "",
      //   address: "",
      //   mobileNumber: "",
      //   whatsAppNumber: "",
      //   courses: [],
      //   courseTimes: {},
      //   admissionFee: "",
      //   image: null,
      // });
      setImagePreview(null);
    } finally {
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

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef })

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <ErrorMessage
          error={{ message: error.message }}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['courses'] })}
        />
      </div>
    );
  }


  console.log(form.dob);

  return (
    <div className="flex flex-col items-center md:py-10 md:px-4">
      <div className="bgGlass shadow-xl rounded-lg w-full p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center dark:text-white">
          <i className="fas fa-user-graduate mr-2 text-blue-600" /> Add New
          Student
        </h1>

        <div className="hidden">
          <div ref={contentRef}>
            <Invoice
              student={response}
              courses={response?.courses}
              totalAmountPaid={response?.totalAmountPaid}
              invoiceID={response?.invoiceID}
            />
          </div>
        </div>

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
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:text-white h-[42px] ${errors.dob
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[#00c2ff80] focus:ring-[#00c2ff80]"
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
              placeholder="Select gender"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-6">

            <Input
              label="Admission Fee"
              name="admissionFee"
              value={form.admissionFee}
              onChange={handleChange}
              icon="fas fa-money-bill-alt"
              placeholder="Enter admission fee"
            />

            <Select
              label="Payment Month"
              name="month"
              value={form.month}
              onChange={handleChange}
              options={MonthNames}
              error={errors.month}
              icon="fas fa-calendar"
              placeholder="Select month"
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              {/* Courses Selection */}
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Select Courses
                </label>
                <MultiSelect
                  options={courses.map((c) => ({ label: c.name, value: c._id }))}
                  selectedOptions={form.courses}
                  onSelectionChange={handleCourseSelection}
                />
                {errors.courses && <p className="text-red-500 text-sm mt-1">{errors.courses}</p>}
              </div>
              {/* Time Slots Selection for Each Course */}
              {selectedCourses.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                    <i className="fas fa-clock mr-2"></i>
                    Select Time Slots for Each Course
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
                            ...course.time.map((timeSlot) => ({
                              label: timeSlot,
                              value: timeSlot
                            })),
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
            disabled={isLoading}
            className="w-full max-w-md mx-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              "Add Student"
            )}
          </button>
        </form>
        {
          response && (
            <button
              onClick={reactToPrintFn}
              className="w-full mt-4 max-w-md mx-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition duration-200 disabled:opacity-50"
            >
              Print Invoice
            </button>
          )
        }

      </div>
    </div>
  );
}
