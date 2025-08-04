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
    "688ace8bb02b418894a0609b"
  ]
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
    courseId: courseId[Math.floor(Math.random() * 3)],
    status: "active",
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

// // Generate 100 random students

// // Output the result
// console.log(JSON.stringify(randomStudents, null, 2));
// ---------------------------------------------------------------------------------------------------------------------------

import Student from "../models/student.model.js";


const createManyStudents = async () => {
  try {
    const students = generateRandomStudents(200);
    await Student.insertMany(students);
    console.log("100,000 random students created successfully.");
  } catch (error) {
    console.error("Error creating students:", error);
  }
};

export const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




export const getStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "active";
  const skip = (page - 1) * limit;


  try {
    // await createManyStudents(); // Call the function to create many students
    const students = await Student.find({ status })
      .select('name fatherName motherName mobileNumber createdAt courseId')
      .populate({
        path: 'courseId',
        select: 'name' // Only fetch the 'name' field from Course
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip);

    // Transform the response to include courseName instead of courseID
    const transformedStudents = students.map(student => {
      const studentObj = student.toObject();
      if (studentObj.courseId) {
        studentObj.courseName = studentObj.courseId.name;
        delete studentObj.courseId; // Remove the original courseID
      }
      return studentObj;
    });

    const totalDocuments = await Student.countDocuments({ status });
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      students: transformedStudents,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchStudents = async (req, res) => {
  const status = req.query.status || "active";
  try {
    const students = await Student.find({
      status,
      $or: [
        { name: { $regex: req.params.query, $options: "i" } },
        { fatherName: { $regex: req.params.query, $options: "i" } },
        { motherName: { $regex: req.params.query, $options: "i" } },
        { mobileNumber: { $regex: req.params.query, $options: "i" } },
        { whatsAppNumber: { $regex: req.params.query, $options: "i" } },
        { address: { $regex: req.params.query, $options: "i" } },
        { schoolName: { $regex: req.params.query, $options: "i" } },
      ],
    }).select('name fatherName motherName mobileNumber createdAt courseId')
    .populate({
      path: 'courseId',
      select: 'name' // Only fetch the 'name' field from Course
    }).sort({ _id: -1 });


    const transformedStudents = students.map(student => {
      const studentObj = student.toObject();
      if (studentObj.courseId) {
        studentObj.courseName = studentObj.courseId.name;
        delete studentObj.courseId; // Remove the original courseID
      }
      return studentObj;
    });
    res.status(200).json(transformedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: 'courseId',
      select: 'name' // Only fetch the 'name' field from Course
    });
    const studentObj = student.toObject();
    if (studentObj.courseId) {
      studentObj.courseName = studentObj.courseId.name;
      // delete studentObj.courseId; // Remove the original courseID
    }
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(studentObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
