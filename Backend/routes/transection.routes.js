import express from "express";
import { createTransaction, deleteTransaction, getTransactions, searchTransactions, updateTransaction } from "../controllers/transection.controller.js";

const router = express.Router();

router.post("/createTransaction", createTransaction);
router.get("/getTransactions", getTransactions);
router.get("/searchTransactions", searchTransactions);
router.put("/updateTransaction/:id", updateTransaction);
router.delete("/deleteTransaction/:id", deleteTransaction);

export default router;