import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import { createError } from "../utils/error.js";

/**
 * Create a new enrollment
 * POST /api/enrollments
 */
export const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseId, selectedTime, admissionFee = 0, notes } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !selectedTime) {
      return next(createError(400, "Student ID, Course ID, and Selected Time are required"));
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return next(createError(404, "Student not found"));
    }

    // Check if course exists and has the selected time
    const course = await Course.findById(courseId);
    if (!course) {
      return next(createError(404, "Course not found"));
    }

    if (!course.time.includes(selectedTime)) {
      return next(createError(400, "Selected time is not available for this course"));
    }

    // Check if student is already enrolled in this course with this time
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
      selectedTime,
      status: { $in: ['active', 'inactive'] }
    });

    if (existingEnrollment) {
      return next(createError(400, "Student is already enrolled in this course with this time slot"));
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId,
      courseId,
      selectedTime,
      admissionFee,
      notes,
      enrollmentDate: new Date(),
      status: 'active'
    });

    const savedEnrollment = await enrollment.save();

    // Populate the response
    const populatedEnrollment = await Enrollment.findById(savedEnrollment._id)
      .populate('studentId', 'name mobileNumber')
      .populate('courseId', 'name fee');

    return res.status(201).json({
      success: true,
      data: populatedEnrollment,
      message: "Student enrolled successfully"
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Get all enrollments with filters
 * GET /api/enrollments
 */
export const getAllEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const courseId = req.query.courseId;
    const selectedTime = req.query.selectedTime;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;
    if (selectedTime) filter.selectedTime = selectedTime;

    const enrollments = await Enrollment.find(filter)
      .populate('studentId', 'name mobileNumber fatherName motherName')
      .populate('courseId', 'name fee')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enrollment.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Get enrollments for a specific student
 * GET /api/enrollments/student/:studentId
 */
export const getStudentEnrollments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const status = req.query.status;

    const filter = { studentId };
    if (status) filter.status = status;

    const enrollments = await Enrollment.find(filter)
      .populate('courseId', 'name fee')
      .sort({ enrollmentDate: -1 });

    return res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Get enrollments for a specific course
 * GET /api/enrollments/course/:courseId
 */
export const getCourseEnrollments = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const selectedTime = req.query.selectedTime;
    const status = req.query.status || 'active';

    const filter = { courseId, status };
    if (selectedTime) filter.selectedTime = selectedTime;

    const enrollments = await Enrollment.find(filter)
      .populate('studentId', 'name mobileNumber fatherName motherName')
      .sort({ enrollmentDate: -1 });

    // Group by time if no specific time is requested
    if (!selectedTime) {
      const groupedByTime = enrollments.reduce((acc, enrollment) => {
        const time = enrollment.selectedTime;
        if (!acc[time]) {
          acc[time] = [];
        }
        acc[time].push(enrollment);
        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        data: {
          groupedByTime,
          totalEnrollments: enrollments.length
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        enrollments,
        totalEnrollments: enrollments.length
      }
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Update enrollment status
 * PUT /api/enrollments/:id
 */
export const updateEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, selectedTime, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (selectedTime) updateData.selectedTime = selectedTime;
    if (notes !== undefined) updateData.notes = notes;

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name mobileNumber')
      .populate('courseId', 'name fee');

    if (!enrollment) {
      return next(createError(404, "Enrollment not found"));
    }

    return res.status(200).json({
      success: true,
      data: enrollment,
      message: "Enrollment updated successfully"
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Delete enrollment
 * DELETE /api/enrollments/:id
 */
export const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return next(createError(404, "Enrollment not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully"
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};

/**
 * Get enrollment statistics
 * GET /api/enrollments/stats
 */
export const getEnrollmentStats = async (req, res, next) => {
  try {
    const stats = await Enrollment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const courseStats = await Enrollment.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: {
            courseId: '$courseId',
            selectedTime: '$selectedTime'
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id.courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseName: '$course.name',
          selectedTime: '$_id.selectedTime',
          enrollmentCount: '$count'
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        courseTimeStats: courseStats
      }
    });
  } catch (error) {
    return next(createError(500, error.message || "Internal server error"));
  }
};