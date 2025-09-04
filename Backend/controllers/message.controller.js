import Student from "../models/student.model.js";
import Message from "../models/message.model.js";
import Payment from "../models/payment.model.js";
import {getStudentEnrolledCourseName} from "../helper/getStudentEnrolledCourseName.js";
import dotenv from "dotenv";
dotenv.config();

const message_URL = process.env.message_URL;
const apiKey = process.env.ApiKey;
const senderId = process.env.SenderID;

function getSmsResponseMessage(code) {
    const responseMessages = {
        1: "SMS Sent Request Successfull",
        2: "ApiKey Not Found || Invalid ApiKey",
        3: "SenderID Not Found || Invalid SenderID",
        4: "Numbers Not Found",
        5: "Invalid Mobile Number",
        6: "SMS Body Not Found || Empty SMS Body",
        7: "Allowed only 1 or 2 for IsUnicode. 1 Means the SMS body is Unicode & 2 means the SMS body is not Unicode.",
        10: "Not Enough Balance",
        11: "Balance and SMS rate",
        101: "Not Enough Balance in your administrator account. Please contact your administrator.",
        405: "Method Not Allowed"
    };

    return responseMessages[code] || "Unknown response code";
}

function getLastDueMonths(dueMonths) {
    const MONTH_NAMES = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
    ];

    const currentMonth = new Date().getMonth(); // 0 = জানুয়ারি, 11 = ডিসেম্বর
    const result = [];

    for (let i = dueMonths; i >= 1; i--) {
        let monthIndex = (currentMonth - i + 12) % 12;
        result.push(MONTH_NAMES[monthIndex]);
    }

    return result;
}
const calculatePaymentSummary = (student, studentPayments) => {

    const courseFee = student.courseId.fee;
    const admissionDate = new Date(student.createdAt);
    const currentDate = new Date();



    // Calculate months from admission to current
    const monthsFromAdmission = (currentDate.getFullYear() - admissionDate.getFullYear()) * 12 +
        (currentDate.getMonth() - admissionDate.getMonth());


    const paidMonths = studentPayments.length;
    const dueMonths = Math.max(0, monthsFromAdmission - paidMonths);
    const totalDue = dueMonths * courseFee;


    return {
        dueMonths,
        totalDue,
        dueMonthsNames: getLastDueMonths(dueMonths)
    };
};

export const messageAmount = async (req, res) => {
    try {
        const response = await fetch(message_URL + "/balance?ApiKey=" + apiKey);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        res.status(200).json({ balance: data?.balance });
    } catch (error) {
        console.error('Fetch error:', error.message);
        res.status(500).json({ message: error.message });
    }
};
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.findOne();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getMessageExample = async (req, res) => {
    try {
        const messageTemplate = await Message.findOne();
        const message = messageTemplate.message
            .replace("{{studentName}}", "ইমরান ইফাদ")
            .replace("{{dueAmount}}", "২০০০")
            .replace("{{currentMonthNameYear}}", new Date().toLocaleString("bn-BD", { month: "long", year: "numeric" }))
            .replace("{{monthName}}", (() => {
                const now = new Date();
                const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return previousMonthDate.toLocaleString("bn-BD", { month: "long" });
            })());
        console.log(message);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message, status } = req.body;
        let MobileNumbers = [];
        if (status === "active" || status === "inactive" || status === "completed") {
            MobileNumbers = await Student.find({ status }).select("mobileNumber");
        } else {
            MobileNumbers = await Student.find({}).select("mobileNumber");
        }
        if (!MobileNumbers) {
            return res.status(404).json({ message: "Student not found" });
        }
        MobileNumbers = MobileNumbers.map((student) => student.mobileNumber);
        if (MobileNumbers.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }


        const response = await fetch(message_URL + "/sms?ApiKey=" + apiKey + "&SenderID=" + senderId + "&IsUnicode=1" + "&number=" + MobileNumbers.map((number) => number).join(",") + "&sms=" + message);
        const data = await response.json();
        console.log(data);
        res.status(200).json({ message: getSmsResponseMessage(data?.ErrorCode) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendDueMessage = async (req, res) => {
    try {
        const messageTemplate = await Message.findOne();

        const students = await Student.find({ status: "active" })
            .select("mobileNumber name createdAt ");



        let totalSentMessageAmount = 0;
        for (const student of students) {
            const { courseNames, totalFee } = await getStudentEnrolledCourseName(student._id);
            const message = messageTemplate.message
                .replace("{{studentName}}", student.name)
                .replace("{{dueAmount}}", totalFee)
                .replace("{{currentMonthNameYear}}", new Date().toLocaleString("bn-BD", { month: "long", year: "numeric" }))
                .replace("{{monthName}}", courseNames);

            if (totalDue > 0) {
                try {
                    const response = await fetch(message_URL + "/sms?ApiKey=" + apiKey + "&SenderId=" + senderId + "&IsUnicode=1" + "&number=" + student.mobileNumber + "&sms=" + message);
                    const data = await response.json();
                    if(data?.ErrorCode === "1") totalSentMessageAmount += 1;
                    console.log(data);
                } catch (error) {
                    console.log(error);
                }
            }
        }


        res.status(200).json({ message: "Message sent successfully", totalSentMessageAmount, totalStudent: students.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};