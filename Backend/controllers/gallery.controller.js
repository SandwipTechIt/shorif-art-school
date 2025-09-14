import Gallery from "../models/gallery.model.js";
import { getImageUrl, deleteImage, getFilenameFromUrl } from "../utils/imageUtils.js";

export const addGallery = async (req, res) => {
    try {
        if (!req.files?.image || req.files.image.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        // Validate category
        const { category } = req.body;
        const validCategories = ['Calligraphy', 'Handwriting', 'Drawing'];
        
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }
        
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                error: "Invalid category. Must be one of: Calligraphy, Handwriting, Drawing" 
            });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const images = req.files.image.map((image) => {
            return {
                category: category,
                img: getImageUrl(image.filename, baseUrl)
            };
        });

        const insertedImages = await Gallery.insertMany(images);

        res.status(201).json({
            message: "Images added successfully",
            images: insertedImages
        });
    } catch (error) {
        console.error("Error adding gallery images:", error);
        res.status(500).json({
            error: "Failed to add images to gallery",
            details: error.message
        });
    }
}

export const getAllGallery = async (req, res) => {
    try {
        const gallery = await Gallery.find().sort({ _id: -1 });
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndDelete(req.params.id);
        if (!gallery) {
            return res.status(404).json({ error: "Gallery not found" });
        }
        const imgurl = getFilenameFromUrl(gallery.img)
        console.log(imgurl)
        await deleteImage(imgurl)
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
