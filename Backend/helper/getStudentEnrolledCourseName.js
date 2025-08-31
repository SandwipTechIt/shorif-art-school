import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
export const getStudentEnrolledCourseName = async (studentId) => {
    try {
        const enrollments = await Enrollment.find({ studentId }).select('courseName fee');
        if (!enrollments || enrollments.length === 0) {
            return "Not Enrolled";
        }
        const courseNames = enrollments.map(e => e.courseName).join(', ');
        const totalFee = enrollments.reduce((sum, e) => Number(sum) + Number(e.fee), 0);

        return {
            courseNames,
            totalFee,
        };
    } catch (error) {
        console.error(`Error fetching enrolled courses for student ${studentId}:`, error);
        return "Error fetching courses";
    }
};


export const createEnrollmentsForStudent = async (studentId, courses, courseTimes) => {
    if (!courses?.length) return [];

    const enrollments = [];

    for (let i = 0; i < courses.length; i++) {
        const courseId = courses[i];
        const course = await Course.findById(courseId).select('name fee');

        if (!course) continue;

        // Get course time - support both object and array formats
        const courseTime = courseTimes?.[courseId] || courseTimes?.[i] || 'TBD';

        const enrollment = new Enrollment({
            studentId,
            courseName: course.name,
            courseTime,
            fee: course.fee,
        });

        const savedEnrollment = await enrollment.save();
        enrollments.push(savedEnrollment);
    }

    return enrollments;
};