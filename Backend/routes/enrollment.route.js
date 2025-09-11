import express from "express";
const Router = express.Router();

import { authMiddleware } from "../middleware/middleware.js";

import {
  createEnrollment,
  getAllEnrollments,
  getStudentEnrollments,
  getCourseEnrollments,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentStats
} from "../controllers/enrollment.controller.js";

// Enrollment CRUD operations
Router.post("/", authMiddleware, createEnrollment);
Router.get("/", authMiddleware, getAllEnrollments);
Router.put("/:id", authMiddleware, updateEnrollment);
Router.delete("/:id", authMiddleware, deleteEnrollment);

// Get enrollments by student
Router.get("/student/:studentId", authMiddleware, getStudentEnrollments);

// Get enrollments by course
Router.get("/course/:courseId", authMiddleware, getCourseEnrollments);

// Get enrollment statistics
Router.get("/stats", authMiddleware, getEnrollmentStats);

export default Router;