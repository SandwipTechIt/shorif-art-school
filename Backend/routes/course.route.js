import express from "express";
const Router = express.Router();

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

Router.post("/createCourse", createCourse);
Router.get("/getCourses", getCourses);
Router.get("/getCourse/:id", getCourseById);
Router.put("/updateCourse/:id", updateCourse);
Router.delete("/deleteCourse/:id", deleteCourse);

export default Router;
