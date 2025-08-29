import mongoose from "mongoose";

// Alternative approach: Course with Sections
const courseSectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sections: [
      {
        sectionName: {
          type: String,
          required: true,
          trim: true,
          // e.g., "Morning Batch", "Evening Batch"
        },
        time: {
          type: String,
          required: true,
          trim: true,
          // e.g., "9:00 AM - 11:00 AM"
        },
        maxStudents: {
          type: Number,
          default: 30,
        },
        currentEnrollment: {
          type: Number,
          default: 0,
        },
      },
    ],
    fee: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const CourseSection = mongoose.model("CourseSection", courseSectionSchema);
export default CourseSection;