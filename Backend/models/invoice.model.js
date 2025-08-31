// payment.model.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        studentID: {
            type: String,
            required: true,
        },
        months: [{
            type: Number,
            required: true,
        }],
        amount: {
            type: Number,
            required: true,
        },
        due: {
            type: Number,
            required: true,
        },
        paymentIds: [{
            type: String,
            required: true,
        }]
    },
    { timestamps: true }
);

// Indexes for faster queries
invoiceSchema.index({ studentId: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
