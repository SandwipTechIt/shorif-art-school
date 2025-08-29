import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    courseName: {
      type: String,
      required: true,
    },
    courseTime: {
      type: String,
      required: true,
    },
    fee: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ studentId: 1, courseName: 1, courseTime: 1 }, { unique: true });

// Index for efficient queries
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseName: 1 });
enrollmentSchema.index({ courseTime: 1 });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;