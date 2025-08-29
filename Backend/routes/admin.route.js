import express from "express";
const router = express.Router();

import { loginAdmin, updateAdmin, logoutAdmin } from "../controllers/admin.controller.js";

router.post("/loginAdmin", loginAdmin);
router.post("/updateAdmin/:id", updateAdmin);
router.post("/logoutAdmin", logoutAdmin);

export default router;
