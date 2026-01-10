

// Fellowship Controller

import { Fellowship } from "../models/Fellowship.model.js";
import { User } from "../models/User.js";
import { Region } from "../models/region.model.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const createFellowship = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);

    // Find region by id
    if (sanitizedBody.region) {
        const region = await Region.findById(sanitizedBody.region);
        if (!region) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
    }

    // Find coordinator by zionId
    const coordinatorUser = await User.findOne({ zionId: sanitizedBody.coordinator });
    if (!coordinatorUser) {
        return res.status(400).json({
            message: "Coordinator not found",
        });
    }
    sanitizedBody.coordinator = coordinatorUser._id;

    // Find evngCoordinator if provided
    if (sanitizedBody.evngCoordinator !== undefined && sanitizedBody.evngCoordinator !== '' && sanitizedBody.evngCoordinator !== '0') {
        const evngUser = await User.findOne({ zionId: sanitizedBody.evngCoordinator });
        if (!evngUser) {
            return res.status(400).json({
                message: "Evangelism Coordinator not found",
            });
        }
        sanitizedBody.evngCoordinator = evngUser._id;
    } else {
        delete sanitizedBody.evngCoordinator;
    }

    // Find zonalCoordinator if provided
    if (sanitizedBody.zonalCoordinator !== undefined && sanitizedBody.zonalCoordinator !== '' && sanitizedBody.zonalCoordinator !== '0') {
        const zonalUser = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
        if (!zonalUser) {
            return res.status(400).json({
                message: "Zonal Coordinator not found",
            });
        }
        sanitizedBody.zonalCoordinator = zonalUser._id;
    } else {
        delete sanitizedBody.zonalCoordinator;
    }

    const fellowship = new Fellowship(sanitizedBody);
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
    console.log(fellowship);
    res.json({
        message: "Fellowship found",
        fellowship,
    });
});

export const updateFellowship = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    // Find region by id if provided
    if (sanitizedBody.region) {
        const region = await Region.findById(sanitizedBody.region);
        if (!region) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
    }

    // Find coordinator by zionId if provided
    if (sanitizedBody.coordinator) {
        const coordinatorUser = await User.findOne({ zionId: sanitizedBody.coordinator });
        if (!coordinatorUser) {
            return res.status(400).json({
                message: "Coordinator not found",
            });
        }
        sanitizedBody.coordinator = coordinatorUser._id;
    }

    // Find evngCoordinator if provided
    if (sanitizedBody.evngCoordinator !== undefined && sanitizedBody.evngCoordinator !== '' && sanitizedBody.evngCoordinator !== '0') {
        const evngUser = await User.findOne({ zionId: sanitizedBody.evngCoordinator });
        if (!evngUser) {
            return res.status(400).json({
                message: "Evangelism Coordinator not found",
            });
        }
        sanitizedBody.evngCoordinator = evngUser._id;
    } else if (sanitizedBody.evngCoordinator === '' || sanitizedBody.evngCoordinator === '0') {
        sanitizedBody.evngCoordinator = undefined;
    }

    // Find zonalCoordinator if provided
    if (sanitizedBody.zonalCoordinator !== undefined && sanitizedBody.zonalCoordinator !== '' && sanitizedBody.zonalCoordinator !== '0') {
        const zonalUser = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
        if (!zonalUser) {
            return res.status(400).json({
                message: "Zonal Coordinator not found",
            });
        }
        sanitizedBody.zonalCoordinator = zonalUser._id;
    } else if (sanitizedBody.zonalCoordinator === '' || sanitizedBody.zonalCoordinator === '0') {
        sanitizedBody.zonalCoordinator = undefined;
    }

    const fellowship = await Fellowship.findByIdAndUpdate(id, sanitizedBody, {
        new: true,
        runValidators: true,
    }).populate('coordinator evngCoordinator zonalCoordinator');
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
    const fellowships = await Fellowship.find().populate('coordinator evngCoordinator zonalCoordinator zone subzone region');
    res.json({
        message: "Fellowships found",
        fellowships,
    });
});