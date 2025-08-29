import express from "express";
const Router = express.Router();

// import {middleware} from "../utils/verifyToken.js";
import { middleware } from "../middleware/middleware.js";

import {
  getStudentPayment,
  createPayment,
  searchStudent,
  getAllPayments,
  getAllPaymentsByInvoice,
  // New enrollment-based methods
  getStudentPaymentHistory,
  createEnrollmentPayment,
  getStudentEnrollmentsWithPayments
} from "../controllers/payment.controller.js";

// Legacy routes (for backward compatibility)
Router.post("/createPayment/:studentId", createPayment);
Router.get("/getStudentPayment/:studentId", middleware, getStudentPayment);
Router.get("/searchStudent/:query", searchStudent);
Router.get("/getAllPayments", middleware, getAllPayments);
Router.get("/getAllPaymentByInvoice/:id", middleware, getAllPaymentsByInvoice);

// New enrollment-based payment routes
Router.get("/student/:studentId/enrollment/:enrollmentId/history", middleware, getStudentPaymentHistory);
Router.post("/enrollment/:enrollmentId", middleware, createEnrollmentPayment);
Router.get("/student/:studentId/enrollments", middleware, getStudentEnrollmentsWithPayments);


export default Router;
