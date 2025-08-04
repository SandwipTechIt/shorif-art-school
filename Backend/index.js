import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

import connectDB from "./config/db.js";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, Shorif Art Backend!");
});

import studentRoutes from "./routes/student.route.js";
import courseRoutes from "./routes/course.route.js";
app.use(studentRoutes);
app.use(courseRoutes);

// app.get("/", (req, res) => {
//   res.status(200).send("Hello, Shorif Art Backend!");
// });

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
