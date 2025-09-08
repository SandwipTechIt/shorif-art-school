import Application from "../models/application.model.js"
import { createError } from "../utils/error.js";

export const createApplication = async (req, res, next) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    return next(createError(400, error.message));
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    return next(createError(500, error.message));
  }
};


export const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return next(createError(404, "Application not found"));
        }
        res.status(200).json(application);
    } catch (error) {
        return next(createError(500, error.message));
    }
}

export const deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) {
            return next(createError(404, "Application not found"));
        }
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        return next(createError(500, error.message));
    }
}