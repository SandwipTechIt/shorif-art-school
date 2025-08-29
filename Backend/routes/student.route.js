import express from "express";
const Router = express.Router();

import { middleware } from "../middleware/middleware.js";
import { uploadCategoryImage, handleUploadError } from "../middleware/upload.middleware.js";


import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
} from "../controllers/student.controller.js";

Router.post("/createStudent", uploadCategoryImage, handleUploadError, createStudent);
Router.post("/updateStudent/:id", uploadCategoryImage, handleUploadError, updateStudent);



Router.get("/getStudents", middleware, getStudents);
Router.get("/searchStudents/:query", searchStudents);
Router.get("/getStudent/:id", getStudentById);
Router.delete("/deleteStudent/:id", deleteStudent);



export default Router;
