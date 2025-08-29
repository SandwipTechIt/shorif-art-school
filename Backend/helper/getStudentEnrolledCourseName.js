import Enrollment from "../models/enrollment.model.js";

export const getStudentEnrolledCourseName = async (studentId) => {
    try {
        const enrollments = await Enrollment.find({ studentId }).select('courseName');
        if (!enrollments || enrollments.length === 0) {
            return "Not Enrolled";
        }
        return enrollments.map(e => e.courseName).join(', ');
    } catch (error) {
        console.error(`Error fetching enrolled courses for student ${studentId}:`, error);
        return "Error fetching courses";
    }
};