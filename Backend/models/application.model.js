import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    whatsappNumber: {
        type: String
    },
    gender: {
        type: String
    },
    course: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model("Application", ApplicationSchema);
