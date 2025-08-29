// payment.model.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      // min: 0,
      // max: 11,
      // validate: {
      //   validator: Number.isInteger,
      //   message: "Month must be an integer between 0 and 11",
      // },
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

// Indexes for faster queries
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ month: 1, year: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

// this is my payment schema.
// now create two function.
// one will give student payments data admit month to current month.
// it will show admit month to current month status.
// other one is create payment.
// frontend will send payment and discount (if any).
// we have to calculate the payment amount how month of this.
// and add it.

// for example if course fee is 300 and frontend will send 900 then we have to update last three month status.
// please write clean, efficient and industry standard code.
