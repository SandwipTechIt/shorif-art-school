import express from "express";
import { addGallery, deleteGallery, getAllGallery } from "../controllers/gallery.controller.js";
import { uploadGalleryImage, handleUploadError } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/addGallery", uploadGalleryImage, handleUploadError, addGallery);
router.get("/getAllGallery", getAllGallery);
router.delete("/deleteGallery/:id", deleteGallery);

export default router;
