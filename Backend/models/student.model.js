import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    motherName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    profession: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      trim: true,
    },
    schoolName: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    whatsAppNumber: {
      type: String,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", fatherName: "text", motherName: "text" });
studentSchema.index({ mobileNumber: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
