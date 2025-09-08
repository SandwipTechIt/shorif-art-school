import express from "express";
import { createApplication, deleteApplication, getApplicationById, getApplications } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/createApplication", createApplication);
router.get("/getApplications", getApplications);
router.get("/getApplicationById/:id", getApplicationById);
router.delete("/deleteApplication/:id", deleteApplication);


export default router;
