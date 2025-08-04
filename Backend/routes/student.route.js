import express from "express";
const Router = express.Router();

// import {middleware} from "../utils/verifyToken.js";
import { middleware } from "../middleware/middleware.js";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
} from "../controllers/student.controller.js";

Router.post("/createStudent", createStudent);
Router.get("/getStudents", middleware, getStudents);
Router.get("/searchStudents/:query", searchStudents);
Router.get("/getStudent/:id", getStudentById);
Router.put("/updateStudent/:id", updateStudent);
Router.delete("/deleteStudent/:id", deleteStudent);

export default Router;
