import Student from "../models/student.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";



const getLast12MonthsPaidAmount = async () => {
  try {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.getMonth(),         
        year: d.getFullYear(),
        label: d.toLocaleString("default", { month: "long" }),
      });
    }

    const pipeline = [
      {
        $match: {
          $expr: {
            $in: [
              { month: "$month", year: "$year" },
              months.map(m => ({ month: m.month, year: m.year })),
            ],
          },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalPaid: { $sum: "$amountPaid" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const totals = await Payment.aggregate(pipeline);

    const result = months.map(({ month, year, label }) => {
      const found = totals.find(
        t => t._id.month === month && t._id.year === year
      );
      return { month: label, totalPaidAmount: found ? found.totalPaid : 0 };
    });

    return result;
  } catch (error) {
    console.error("Error in getLast12MonthsPaidAmount:", error);
    throw error;
  }
};

export const getStatics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();

    const paymentsAgg = await Payment.aggregate([
      {
        $match: {}
      },
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: { $ifNull: ["$amountPaid", 0] } },
          totalDiscount: { $sum: { $ifNull: ["$discount", 0] } }
        }
      }
    ]);

    const { totalPaidAmount = 0, totalDiscount = 0 } = paymentsAgg[0] || {};

    res.status(200).json({
      totalStudents,
      totalCourses,
      totalPaidAmount,
      totalDiscount,
      last12MonthsPaidAmount: await getLast12MonthsPaidAmount()
    });
  } catch (error) {
    throw error;
  }
};
