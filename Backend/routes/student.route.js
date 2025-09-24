import express from "express";
const Router = express.Router();

import { authMiddleware } from "../middleware/middleware.js";
import { uploadCategoryImage, handleUploadError } from "../middleware/upload.middleware.js";


import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  searchStudents,
} from "../controllers/student.controller.js";

Router.post("/createStudent", authMiddleware, uploadCategoryImage, handleUploadError, createStudent);
Router.post("/updateStudent/:id", authMiddleware, uploadCategoryImage, handleUploadError, updateStudent);



Router.get("/getStudents", getStudents);
Router.get("/searchStudents/:query", searchStudents);
Router.get("/getStudent/:id", getStudentById);
Router.delete("/deleteStudent/:id", authMiddleware, deleteStudent);



export default Router;
