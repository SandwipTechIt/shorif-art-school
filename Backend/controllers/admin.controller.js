import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

dotenv.config();
const secret = process.env.SECRET_KEY;

export const loginAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ name: req.body.name });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        if (admin.password !== req.body.password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ id: admin._id }, secret);

        res.cookie("token", token, {
            httpOnly: true, 
            secure: true,
            sameSite: "Lax",
            path: "/",
        });
        
        res.status(200).json(admin);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

