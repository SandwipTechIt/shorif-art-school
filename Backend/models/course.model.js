import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fee: {
      type: String,
      required: true,
      trim: true,
    },
    time: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    images: [
      {
        id: String,
        fileName: String,
        originalName: String,
        filePath: String,
        url: String,
        size: Number,
        mimeType: String,
        folder: String,
        uploadedAt: Date
      }
    ],
    description: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
