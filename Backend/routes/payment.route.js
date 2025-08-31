import express from "express";
const Router = express.Router();

// import {middleware} from "../utils/verifyToken.js";
import { middleware } from "../middleware/middleware.js";

import {
  getStudentPayment,
  createPayment,
  getAllPayments,
  deletePayment,
  searchPayments,
  getAllDues
} from "../controllers/payment.controller.js";

// Legacy routes (for backward compatibility)
Router.post("/createPayment/:studentId", createPayment);
Router.get("/getStudentPayment/:studentId", middleware, getStudentPayment);
Router.get("/getAllPayments", middleware, getAllPayments);
Router.post("/searchPayments", middleware, searchPayments);
Router.delete("/deletePayment/:studentId", middleware, deletePayment);

Router.get("/getAllDues", middleware, getAllDues);

export default Router;
