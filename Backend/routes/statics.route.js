import express from "express"
import { getStatics } from "../controllers/statics.controller.js"


const router = express.Router();


router.get("/getStatics", getStatics)

export default router;