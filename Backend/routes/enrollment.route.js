import express from "express";
const Router = express.Router();

import { middleware } from "../middleware/middleware.js";

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
Router.post("/", middleware, createEnrollment);
Router.get("/", middleware, getAllEnrollments);
Router.put("/:id", middleware, updateEnrollment);
Router.delete("/:id", middleware, deleteEnrollment);

// Get enrollments by student
Router.get("/student/:studentId", middleware, getStudentEnrollments);

// Get enrollments by course
Router.get("/course/:courseId", middleware, getCourseEnrollments);

// Get enrollment statistics
Router.get("/stats", middleware, getEnrollmentStats);

export default Router;