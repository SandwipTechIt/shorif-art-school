import Payment from "../models/payment.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";

/**
 * Payment Service - Handles all payment-related operations
 */
class PaymentService {
  /**
   * Get student payment history from enrollment month to current month
   * @param {string} studentId - Student ID
   * @param {string} enrollmentId - Enrollment ID
   * @returns {Object} Payment history with status for each month
   */
  static async getStudentPaymentHistory(studentId, enrollmentId) {
    try {
      // Get enrollment details
      const enrollment = await Enrollment.findById(enrollmentId)
        .populate('courseId', 'name fee')
        .populate('studentId', 'name');

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const enrollmentDate = new Date(enrollment.enrollmentDate);
      const currentDate = new Date();
      
      // Get course fee
      const courseFee = parseFloat(enrollment.courseId.fee);
      
      // Generate months from enrollment to current
      const months = this.generateMonthRange(enrollmentDate, currentDate);
      
      // Get existing payments
      const payments = await Payment.find({
        studentId,
        enrollmentId,
        $or: months.map(month => ({
          month: month.month,
          year: month.year
        }))
      }).sort({ year: 1, month: 1 });

      // Create payment status map
      const paymentMap = new Map();
      payments.forEach(payment => {
        const key = `${payment.year}-${payment.month}`;
        paymentMap.set(key, payment);
      });

      // Build response with status for each month
      const paymentHistory = months.map(monthData => {
        const key = `${monthData.year}-${monthData.month}`;
        const payment = paymentMap.get(key);
        
        return {
          month: monthData.month,
          year: monthData.year,
          monthName: this.getMonthName(monthData.month),
          courseFee,
          amountPaid: payment?.amountPaid || 0,
          discount: payment?.discount || 0,
          status: payment?.status || 'unpaid',
          dueDate: payment?.dueDate || this.calculateDueDate(monthData.year, monthData.month),
          paymentDate: payment?.paymentDate || null,
          transactionId: payment?.transactionId || null,
          paymentMethod: payment?.paymentMethod || null,
          notes: payment?.notes || null
        };
      });

      return {
        success: true,
        data: {
          student: {
            id: enrollment.studentId._id,
            name: enrollment.studentId.name
          },
          course: {
            id: enrollment.courseId._id,
            name: enrollment.courseId.name,
            fee: courseFee
          },
          enrollment: {
            id: enrollment._id,
            selectedTime: enrollment.selectedTime,
            enrollmentDate: enrollment.enrollmentDate,
            status: enrollment.status
          },
          paymentHistory,
          summary: {
            totalMonths: months.length,
            paidMonths: paymentHistory.filter(p => p.status === 'paid').length,
            unpaidMonths: paymentHistory.filter(p => p.status === 'unpaid').length,
            partialMonths: paymentHistory.filter(p => p.status === 'partial').length,
            totalDue: paymentHistory
              .filter(p => p.status !== 'paid')
              .reduce((sum, p) => sum + (courseFee - p.amountPaid - p.discount), 0)
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create payment and auto-distribute across months
   * @param {Object} paymentData - Payment information
   * @returns {Object} Payment creation result
   */
  static async createPayment(paymentData) {
    try {
      const {
        studentId,
        enrollmentId,
        amountPaid,
        discount = 0,
        paymentMethod = 'cash',
        transactionId,
        notes
      } = paymentData;

      // Validate enrollment
      const enrollment = await Enrollment.findById(enrollmentId)
        .populate('courseId', 'fee');

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      if (enrollment.studentId.toString() !== studentId) {
        throw new Error('Student ID does not match enrollment');
      }

      const courseFee = parseFloat(enrollment.courseId.fee);
      let remainingAmount = amountPaid;
      const createdPayments = [];
      const updatedPayments = [];

      // Get unpaid/partial payments in chronological order
      const unpaidPayments = await this.getUnpaidPayments(studentId, enrollmentId);

      for (const unpaidPayment of unpaidPayments) {
        if (remainingAmount <= 0) break;

        const monthlyFee = courseFee;
        const alreadyPaid = unpaidPayment.amountPaid || 0;
        const monthlyDiscount = unpaidPayment.discount || 0;
        const amountNeeded = monthlyFee - alreadyPaid - monthlyDiscount;

        if (amountNeeded <= 0) continue;

        const paymentForThisMonth = Math.min(remainingAmount, amountNeeded);
        const totalPaidForMonth = alreadyPaid + paymentForThisMonth;
        
        let status;
        if (totalPaidForMonth + monthlyDiscount >= monthlyFee) {
          status = 'paid';
        } else if (totalPaidForMonth > 0) {
          status = 'partial';
        } else {
          status = 'unpaid';
        }

        if (unpaidPayment._id) {
          // Update existing payment
          const updatedPayment = await Payment.findByIdAndUpdate(
            unpaidPayment._id,
            {
              amountPaid: totalPaidForMonth,
              status,
              paymentMethod,
              transactionId,
              paymentDate: new Date(),
              notes
            },
            { new: true }
          );
          updatedPayments.push(updatedPayment);
        } else {
          // Create new payment
          const newPayment = new Payment({
            studentId,
            enrollmentId,
            month: unpaidPayment.month,
            year: unpaidPayment.year,
            courseFee: monthlyFee,
            amountPaid: paymentForThisMonth,
            discount: discount > 0 ? Math.min(discount, monthlyFee - paymentForThisMonth) : 0,
            status,
            paymentMethod,
            transactionId,
            dueDate: this.calculateDueDate(unpaidPayment.year, unpaidPayment.month),
            paymentDate: new Date(),
            notes
          });
          
          const savedPayment = await newPayment.save();
          createdPayments.push(savedPayment);
        }

        remainingAmount -= paymentForThisMonth;
      }

      // If there's still remaining amount, create advance payments
      if (remainingAmount > 0) {
        const advancePayments = await this.createAdvancePayments(
          studentId,
          enrollmentId,
          remainingAmount,
          courseFee,
          { paymentMethod, transactionId, notes }
        );
        createdPayments.push(...advancePayments);
      }

      return {
        success: true,
        data: {
          message: 'Payment processed successfully',
          totalAmountProcessed: amountPaid,
          remainingAmount,
          createdPayments: createdPayments.length,
          updatedPayments: updatedPayments.length,
          payments: [...createdPayments, ...updatedPayments]
        }
      };

    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get unpaid/partial payments for an enrollment
   */
  static async getUnpaidPayments(studentId, enrollmentId) {
    const enrollment = await Enrollment.findById(enrollmentId);
    const enrollmentDate = new Date(enrollment.enrollmentDate);
    const currentDate = new Date();
    
    const months = this.generateMonthRange(enrollmentDate, currentDate);
    
    const existingPayments = await Payment.find({
      studentId,
      enrollmentId,
      status: { $in: ['unpaid', 'partial'] }
    }).sort({ year: 1, month: 1 });

    const paymentMap = new Map();
    existingPayments.forEach(payment => {
      const key = `${payment.year}-${payment.month}`;
      paymentMap.set(key, payment);
    });

    return months.map(monthData => {
      const key = `${monthData.year}-${monthData.month}`;
      return paymentMap.get(key) || {
        month: monthData.month,
        year: monthData.year,
        amountPaid: 0,
        discount: 0,
        status: 'unpaid'
      };
    }).filter(payment => payment.status !== 'paid');
  }

  /**
   * Create advance payments for future months
   */
  static async createAdvancePayments(studentId, enrollmentId, remainingAmount, courseFee, paymentDetails) {
    const currentDate = new Date();
    const advancePayments = [];
    let amount = remainingAmount;

    let month = currentDate.getMonth() + 1; // Next month
    let year = currentDate.getFullYear();

    while (amount > 0) {
      if (month > 11) {
        month = 0;
        year++;
      }

      const paymentForMonth = Math.min(amount, courseFee);
      const status = paymentForMonth >= courseFee ? 'paid' : 'partial';

      const payment = new Payment({
        studentId,
        enrollmentId,
        month,
        year,
        courseFee,
        amountPaid: paymentForMonth,
        discount: 0,
        status,
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        dueDate: this.calculateDueDate(year, month),
        paymentDate: new Date(),
        notes: paymentDetails.notes + ' (Advance Payment)'
      });

      const savedPayment = await payment.save();
      advancePayments.push(savedPayment);

      amount -= paymentForMonth;
      month++;
    }

    return advancePayments;
  }

  /**
   * Generate array of months from start date to end date
   */
  static generateMonthRange(startDate, endDate) {
    const months = [];
    const current = new Date(startDate);
    current.setDate(1); // Set to first day of month

    while (current <= endDate) {
      months.push({
        month: current.getMonth(),
        year: current.getFullYear()
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  /**
   * Get month name from month number
   */
  static getMonthName(monthNumber) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber];
  }

  /**
   * Calculate due date for a given month/year
   */
  static calculateDueDate(year, month) {
    const dueDate = new Date(year, month, 5); // 5th of each month
    return dueDate;
  }
}

export default PaymentService;