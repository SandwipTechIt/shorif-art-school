import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";


import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import courseRoutes from "./routes/course.route.js";
import studentRoutes from "./routes/student.route.js";
import paymentRoutes from "./routes/payment.route.js";
import messageRoutes from "./routes/message.route.js";
import staticsRoutes from "./routes/statics.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import transectionRoutes from "./routes/transection.routes.js";


dotenv.config();
const PORT = process.env.PORT || 4000;

connectDB();


const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use("/images", express.static("images"));
app.get("/", (req, res) => {
  res.send("Hello, Shorif Art Backend!");
});


app.use(adminRoutes);
app.use(courseRoutes);
app.use(studentRoutes);
app.use(paymentRoutes);
app.use(messageRoutes);
app.use(staticsRoutes);
app.use(enrollmentRoutes);
app.use(transectionRoutes);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
