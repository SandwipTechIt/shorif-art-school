import express from "express";
const Router = express.Router();

// import {middleware} from "../utils/verifyToken.js";
import { authMiddleware } from "../middleware/middleware.js";

import {
  getStudentPayment,
  createPayment,
  getAllPayments,
  deletePayment,
  searchPayments,
  getAllDues,
  searchDues
} from "../controllers/payment.controller.js";

// Legacy routes (for backward compatibility)
// Router.post("/createPayment/:studentId", createPayment);
// Router.get("/getStudentPayment/:studentId", authMiddleware, getStudentPayment);
// Router.get("/getAllPayments", authMiddleware, getAllPayments);
// Router.post("/searchPayments", authMiddleware, searchPayments);
// Router.delete("/deletePayment/:studentId", authMiddleware, deletePayment);

// Router.get("/getAllDues", authMiddleware, getAllDues);
// Router.post("/searchDues", authMiddleware, searchDues);



Router.post("/createPayment/:studentId", createPayment);
Router.get("/getStudentPayment/:studentId", getStudentPayment);
Router.get("/getAllPayments", getAllPayments);
Router.post("/searchPayments", searchPayments);
Router.delete("/deletePayment/:studentId", deletePayment);

Router.get("/getAllDues", getAllDues);
Router.post("/searchDues", searchDues);

export default Router;
