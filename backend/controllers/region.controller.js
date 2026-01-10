import { Region } from "../models/region.model.js";
import { User } from "../models/User.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const createRegion = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);

    // Find regionalCoordinator by zionId
    const regionalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.regionalCoordinator });
    if (!regionalCoordinatorUser) {
        return res.status(400).json({
            message: "Regional Coordinator not found",
        });
    }
    sanitizedBody.regionalCoordinator = regionalCoordinatorUser._id;

    // Find zonalCoordinators if provided
    if (sanitizedBody.zonalCoordinators && Array.isArray(sanitizedBody.zonalCoordinators)) {
        const zonalIds = [];
        for (const zionId of sanitizedBody.zonalCoordinators) {
            const user = await User.findOne({ zionId });
            if (!user) {
                return res.status(400).json({
                    message: `Zonal Coordinator with zionId ${zionId} not found`,
                });
            }
            zonalIds.push(user._id);
        }
        sanitizedBody.zonalCoordinators = zonalIds;
    }

    // Find evngCoordinators if provided
    if (sanitizedBody.evngCoordinators && Array.isArray(sanitizedBody.evngCoordinators)) {
        const evngIds = [];
        for (const zionId of sanitizedBody.evngCoordinators) {
            const user = await User.findOne({ zionId });
            if (!user) {
                return res.status(400).json({
                    message: `Evangelism Coordinator with zionId ${zionId} not found`,
                });
            }
            evngIds.push(user._id);
        }
        sanitizedBody.evngCoordinators = evngIds;
    }

    const region = new Region(sanitizedBody);
    await region.save();
    res.status(201).json({
        message: "Region created successfully",
        region,
    });
});

export const getRegion = TryCatch(async (req, res) => {
    const { id } = req.params;
    const region = await Region.findById(id).populate('regionalCoordinator zonalCoordinators evngCoordinators allMembers subZones fellowships');
    if (!region) {
        return res.status(404).json({
            message: "Region not found",
        });
    }
    res.json({
        message: "Region found",
        region,
    });
});

export const getAllRegions = TryCatch(async (req, res) => {
    const regions = await Region.find().populate('regionalCoordinator zonalCoordinators evngCoordinators allMembers subZones fellowships');
    res.json({
        message: "Regions found",
        regions,
    });
});

export const updateRegion = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    // Find regionalCoordinator by zionId if provided
    if (sanitizedBody.regionalCoordinator) {
        const regionalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.regionalCoordinator });
        if (!regionalCoordinatorUser) {
            return res.status(400).json({
                message: "Regional Coordinator not found",
            });
        }
        sanitizedBody.regionalCoordinator = regionalCoordinatorUser._id;
    }

    // Find zonalCoordinators if provided
    if (sanitizedBody.zonalCoordinators && Array.isArray(sanitizedBody.zonalCoordinators)) {
        const zonalIds = [];
        for (const zionId of sanitizedBody.zonalCoordinators) {
            const user = await User.findOne({ zionId });
            if (!user) {
                return res.status(400).json({
                    message: `Zonal Coordinator with zionId ${zionId} not found`,
                });
            }
            zonalIds.push(user._id);
        }
        sanitizedBody.zonalCoordinators = zonalIds;
    }

    // Find evngCoordinators if provided
    if (sanitizedBody.evngCoordinators && Array.isArray(sanitizedBody.evngCoordinators)) {
        const evngIds = [];
        for (const zionId of sanitizedBody.evngCoordinators) {
            const user = await User.findOne({ zionId });
            if (!user) {
                return res.status(400).json({
                    message: `Evangelism Coordinator with zionId ${zionId} not found`,
                });
            }
            evngIds.push(user._id);
        }
        sanitizedBody.evngCoordinators = evngIds;
    }

    const region = await Region.findByIdAndUpdate(id, sanitizedBody, {
        new: true,
        runValidators: true,
    }).populate('regionalCoordinator zonalCoordinators evngCoordinators allMembers subZones fellowships');
    if (!region) {
        return res.status(404).json({
            message: "Region not found",
        });
    }
    res.json({
        message: "Region updated successfully",
        region,
    });
});

export const deleteRegion = TryCatch(async (req, res) => {
    const { id } = req.params;
    const region = await Region.findById(id);
    if (!region) {
        return res.status(404).json({
            message: "Region not found",
        });
    }

    if (region.totalMembers > 0) {
        return res.status(400).json({
            message: "Cannot delete region with members",
        });
    }
    await Region.findByIdAndDelete(id);
    res.json({
        message: "Region deleted successfully",
    });
});