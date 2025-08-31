// Generate 100 random students
// Arrays of possible values
const maleFirstNames = [
  "Abdul",
  "Mohammed",
  "Ahmed",
  "Rahim",
  "Karim",
  "Jamal",
  "Kamal",
  "Rashed",
  "Habib",
  "Arif",
  "Babul",
  "Sohel",
  "Noman",
  "Rafiq",
  "Salam",
  "Imran",
  "Faruk",
  "Sohag",
  "Tanim",
  "Emon",
];
const femaleFirstNames = [
  "Fatima",
  "Ayesha",
  "Khatun",
  "Rahima",
  "Akter",
  "Begum",
  "Roksana",
  "Jannat",
  "Sumaiya",
  "Tasnim",
  "Nusrat",
  "Farhana",
  "Shirin",
  "Lima",
  "Priya",
  "Sabina",
  "Rita",
  "Sultana",
  "Mousumi",
  "Tania",
];
const maleLastNames = [
  "Khan",
  "Hossain",
  "Islam",
  "Chowdhury",
  "Ahmed",
  "Rahman",
  "Ali",
  "Akhtar",
  "Sarkar",
  "Haque",
];
const femaleLastNames = [
  "Khatun",
  "Akter",
  "Begum",
  "Sultana",
  "Parveen",
  "Nahar",
  "Jahan",
  "Yesmin",
  "Shilpi",
  "Riya",
];
const schoolNames = [
  "Viqarunnisa Noon School & College",
  "St. Joseph Higher Secondary School",
  "Dhaka Residential Model College",
  "Holy Cross College",
  "Rajuk Uttara Model College",
  "Ideal School and College",
  "Monipur High School & College",
  "Saint Gregory's High School & College",
  "Dhanmondi Government Boys' High School",
  "Motijheel Government Boys' High School",
  "Viquarunnesa Noon School",
  "Government Laboratory High School",
  "Rifles Public School & College",
  "Uttara High School",
  "Willes Little Flower Higher Secondary School",
  "Maple Leaf International School",
  "Mastermind School",
  "South Breeze School",
  "Oxford International School",
  "Scholastica School",
];
const areas = [
  "Baily Road, Dhaka",
  "Dhanmondi, Dhaka",
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Mohammadpur, Dhaka",
  "Old Dhaka",
  "Tejgaon, Dhaka",
  "Ramna, Dhaka",
  "Khilgaon, Dhaka",
  "Badda, Dhaka",
  "Shyamoli, Dhaka",
  "Farmgate, Dhaka",
  "Malibagh, Dhaka",
  "Baridhara, Dhaka",
  "Cantonment, Dhaka",
  "Basundhara, Dhaka",
  "Nikunja, Dhaka",
  "Khilkhet, Dhaka",
];
const mobilePrefixes = ["013", "014", "015", "016", "017", "018", "019"];

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date of birth between 2005 and 2015
function generateRandomDOB() {
  const year = getRandomInt(2005, 2015);
  const month = getRandomInt(1, 12);
  const day = getRandomInt(1, 28); // Using 28 to avoid issues with different month lengths
  return new Date(year, month - 1, day).toISOString();
}

// Function to generate a random mobile number
function generateRandomMobileNumber() {
  const prefix = mobilePrefixes[getRandomInt(0, mobilePrefixes.length - 1)];
  let number = prefix;
  for (let i = 0; i < 8; i++) {
    number += getRandomInt(0, 9);
  }
  return number;
}
function getRandomStatus() {
  const statuses = ["active", "inactive", "completed"];
  return statuses[Math.floor(Math.random() * statuses.length)];
}
// Function to generate a random student
function generateRandomStudent() {
  const gender = Math.random() > 0.5 ? "male" : "female";
  const firstName =
    gender === "male"
      ? maleFirstNames[getRandomInt(0, maleFirstNames.length - 1)]
      : femaleFirstNames[getRandomInt(0, femaleFirstNames.length - 1)];
  const lastName =
    gender === "male"
      ? maleLastNames[getRandomInt(0, maleLastNames.length - 1)]
      : femaleLastNames[getRandomInt(0, femaleLastNames.length - 1)];
  const fatherName =
    maleFirstNames[getRandomInt(0, maleFirstNames.length - 1)] +
    " " +
    maleLastNames[getRandomInt(0, maleLastNames.length - 1)];
  const motherName =
    femaleFirstNames[getRandomInt(0, femaleFirstNames.length - 1)] +
    " " +
    femaleLastNames[getRandomInt(0, femaleLastNames.length - 1)];

  const mobileNumber = generateRandomMobileNumber();
  const courseId = [
    "688acebab02b418894a0609f",
    "688acea0b02b418894a0609d",
    "688ace8bb02b418894a0609b",
  ];
  return {
    name: firstName + " " + lastName,
    fatherName: fatherName,
    motherName: motherName,
    dob: generateRandomDOB(),
    profession: "Student",
    gender: gender,
    schoolName: schoolNames[getRandomInt(0, schoolNames.length - 1)],
    address: areas[getRandomInt(0, areas.length - 1)],
    mobileNumber: mobileNumber,
    whatsAppNumber: mobileNumber,
    courses: '["68b0a7c189052c517b7cda68","68b0a79689052c517b7cda62"]',
    courseTimes: '{"68b0a7c189052c517b7cda68":"8:00 AM","68b0a79689052c517b7cda62":"1:00 PM"}',
    admissionFee: '2000',
    status: getRandomStatus(),
    img: "http://192.168.0.200:3000/images/image-1756437412479-240071824.png"
  };
}

// Function to generate multiple random students
function generateRandomStudents(count) {
  const students = [];
  for (let i = 0; i < count; i++) {
    students.push(generateRandomStudent());
  }
  return students;
}
// // Output the result
// console.log(JSON.stringify(randomStudents, null, 2));
// ---------------------------------------------------------------------------------------------------------------------------

import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Counter from "../models/studentID.model.js";
import Payment from "../models/payment.model.js";

import { deleteImage, getImageUrl, getFilenameFromUrl } from "../utils/imageUtils.js";
import { getStudentEnrolledCourseName, createEnrollmentsForStudent } from "../helper/getStudentEnrolledCourseName.js";





export const createStudent = async (req, res) => {
  try {
    let studentData = { ...req.body };

    // Handle courses and courseTimes if they are JSON strings
    if (typeof studentData.courses === 'string') {
      studentData.courses = JSON.parse(studentData.courses);
    }
    if (typeof studentData.courseTimes === 'string') {
      studentData.courseTimes = JSON.parse(studentData.courseTimes);
    }

    const { courses, courseTimes, ...rest } = studentData;

    if (req.files?.image?.length > 0) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      rest.img = getImageUrl(req.files.image[0].filename, baseUrl)
    }
    await Counter.findByIdAndUpdate(
      "studentId",
      { $setOnInsert: { seq: 1000 } },
      { upsert: true }
    );
    const student = new Student(rest);
    const response = await student.save();


    const studentEnrollment = await createEnrollmentsForStudent(response._id, courses, courseTimes);
    const totalFee = studentEnrollment.reduce((total, enrollment) => total + Number(enrollment.fee), 0);

    const paymentData = {
      studentId: response._id,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      amount: totalFee
    }
    const payment = new Payment(paymentData);
    await payment.save();


    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: response
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createManyStudents = async () => {
  try {
    const students = generateRandomStudents(10);
    for (let i = 0; i < students.length; i++) {
      if (typeof students[i].courses === 'string') {
        students[i].courses = JSON.parse(students[i].courses);
      }
      if (typeof students[i].courseTimes === 'string') {
        students[i].courseTimes = JSON.parse(students[i].courseTimes);
      }
      const { courses, courseTimes, ...rest } = students[i];
      await Counter.findByIdAndUpdate(
        "studentId",
        { $setOnInsert: { seq: 1000 } },
        { upsert: true }
      );
      const student = new Student(rest);
      const response = await student.save();
      await createEnrollmentsForStudent(response._id, courses, courseTimes);
    }
  } catch (error) {
    console.error("Error creating students:", error);
  }
}

export const getStudents = async (req, res) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }


  try {

    const students = await Student.find(query)
      .select("id img name fatherName motherName mobileNumber whatsAppNumber createdAt courseId")
      .sort({ _id: -1 })
      .limit(200)


    // await createManyStudents();


    const studentsWithCourseData = await Promise.all(
      students.map(async (student) => {
        const studentObj = student.toObject();
        const { courseNames, totalFee } = await getStudentEnrolledCourseName(student._id);
        studentObj.courseName = courseNames;
        studentObj.totalFee = totalFee;
        return studentObj;
      })
    );

    res.status(200).json(studentsWithCourseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchStudents = async (req, res) => {
  const status = req.query.status || "active";
  try {
    const students = await Student.find({
      status,
    })
      .select("name fatherName motherName mobileNumber createdAt")
      // .populate({
      //   path: "courseId",
      //   select: "name", // Only fetch the 'name' field from Course
      // })
      .sort({ _id: -1 });

    // const transformedStudents = students.map((student) => {
    //   const studentObj = student.toObject();
    //   if (studentObj) {
    //     studentObj.courseName = studentObj.courseId.name;
    //     delete studentObj.courseId; // Remove the original courseID
    //   }
    //   return studentObj;
    // });

    console.log(students);

    res.status(200).json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get enrollments for this student
    const enrollments = await Enrollment.find({ studentId: req.params.id });

    // Convert to object and add enrollments
    const studentObj = student.toObject();
    studentObj.enrollments = enrollments;

    // Map enrollments to create courses and courseTimes data for frontend compatibility
    const coursesData = [];
    const courseTimesData = {};

    // For each enrollment, we need to find the corresponding course to get the courseId
    for (const enrollment of enrollments) {
      try {
        const course = await Course.findOne({ name: enrollment.courseName });
        if (course) {
          coursesData.push(course._id.toString());
          courseTimesData[course._id.toString()] = enrollment.courseTime;
        }
      } catch (courseError) {
        console.warn(`Could not find course for enrollment: ${enrollment.courseName}`);
      }
    }

    studentObj.courses = coursesData;
    studentObj.courseTimes = courseTimesData;

    res.status(200).json(studentObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    let studentData = { ...req.body };

    // Handle courses and courseTimes if they are JSON strings
    if (typeof studentData.courses === 'string') {
      studentData.courses = JSON.parse(studentData.courses);
    }
    if (typeof studentData.courseTimes === 'string') {
      studentData.courseTimes = JSON.parse(studentData.courseTimes);
    }

    // Find the student to get the old image path if it exists
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }


    // Remove non-student fields from update data
    const { courses, courseTimes, removeImage, ...updateData } = studentData;

    // Handle new image upload
    if (removeImage && student.img) {
      try {
        await deleteImage(getFilenameFromUrl(student.img));
        updateData.img = null;
      } catch (deleteError) {
        console.error("Error deleting image, but proceeding with update:", deleteError);
        updateData.img = null;
      }
    } else if (req.files && req.files.image && req.files.image.length > 0) {
      // If there's a new image, delete the old one
      if (student.img) {
        try {
          await deleteImage(getFilenameFromUrl(student.img));
        } catch (deleteError) {
          console.error("Error deleting old image, but proceeding with update:", deleteError);
        }
      }
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      updateData.img = getImageUrl(req.files.image[0].filename, baseUrl);
    }



    // Update student record
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Update enrollments if courses are provided
    if (courses && Array.isArray(courses)) {
      await Enrollment.deleteMany({ studentId: req.params.id });
      await createEnrollmentsForStudent(req.params.id, courses, courseTimes);
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export utility function for use in other parts of the application
export { createEnrollmentsForStudent };
