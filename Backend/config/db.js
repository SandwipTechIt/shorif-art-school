const URL = "mongodb://localhost:27017/shorifArtDB";
// const URL = "mongodb://localhost:27017/shorifArtDB";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
