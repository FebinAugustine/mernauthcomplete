

// Fellowship Controller

import { Fellowship } from "../models/Fellowship.model.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const createFellowship = TryCatch(async (req, res) => {
    const sanitezedBody = sanitize(req.body);
    const fellowship = new Fellowship(sanitezedBody);
    await fellowship.save();
    res.status(201).json({
        message: "Fellowship created successfully",
        fellowship,
    });
});

export const getFellowship = TryCatch(async (req, res) => {
    const { id } = req.params;
    const fellowship = await Fellowship.findById(id);
    if (!fellowship) {
        return res.status(404).json({
            message: "Fellowship not found",
        });
    }
    res.json({
        message: "Fellowship found",
        fellowship,
    });
});

export const updateFellowship = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitezedBody = sanitize(req.body);
    const fellowship = await Fellowship.findByIdAndUpdate(id, sanitezedBody, {
        new: true,
        runValidators: true,
    });
    if (!fellowship) {
        return res.status(404).json({
            message: "Fellowship not found",
        });
    }
    res.json({
        message: "Fellowship updated successfully",
        fellowship,
    });
});

export const deleteFellowship = TryCatch(async (req, res) => {
    const { id } = req.params;
    const fellowship = await Fellowship.findByIdAndDelete(id);
    if (!fellowship) {
        return res.status(404).json({
            message: "Fellowship not found",
        });
    }

    if (fellowship.allMembers.length > 0) {
        return res.status(400).json({
            message: "Cannot delete fellowship with members",
        });
    }
    res.json({
        message: "Fellowship deleted successfully",
    });
});

export const getAllFellowships = TryCatch(async (req, res) => {
    const fellowships = await Fellowship.find();
    res.json({
        message: "Fellowships found",
        fellowships,
    });
});