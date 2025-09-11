import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    }
})

export default mongoose.model("Gallery", gallerySchema);
