import mongoose from "mongoose";
import Counter from "./studentID.model.js";
const studentSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
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
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
    admissionFee: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (this.isNew && this.id === undefined) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "studentId",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

studentSchema.index({ name: "text", fatherName: "text", motherName: "text" });
studentSchema.index({ mobileNumber: 1, id: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
