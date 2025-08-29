import express from "express";
import { messageAmount, sendMessage, sendDueMessage, updateMessage, getMessages, getMessageExample } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/messageAmount", messageAmount);
router.get("/getMessageTemplete", getMessages);
router.get("/getMessageExample", getMessageExample);
router.post("/updateMessageTemplete/:id", updateMessage);
router.post("/sendMessage", sendMessage);
router.post("/sendDueMessage", sendDueMessage);

export default router;
