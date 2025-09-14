import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Calligraphy', 'Handwriting', 'Drawing'],
        message: 'Category must be one of: Calligraphy, Handwriting, Drawing'
    },
    img: {
        type: String,
        required: true
    }
})

export default mongoose.model("Gallery", gallerySchema);
