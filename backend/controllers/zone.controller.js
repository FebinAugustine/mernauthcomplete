import { Zone } from "../models/zone.model.js";
import { User } from "../models/User.js";
import { Region } from "../models/region.model.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

export const createZone = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);

    // Find region by id or name? Assuming id is sent
    if (sanitizedBody.region) {
        const region = await Region.findById(sanitizedBody.region);
        if (!region) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
        // region is already ObjectId
    }

    // Find regionalCoordinator if provided
    if (sanitizedBody.regionalCoordinator) {
        const regionalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.regionalCoordinator });
        if (!regionalCoordinatorUser) {
            return res.status(400).json({
                message: "Regional Coordinator not found",
            });
        }
        sanitizedBody.regionalCoordinator = regionalCoordinatorUser._id;
    }

    // Find zonalCoordinator if provided
    if (sanitizedBody.zonalCoordinator) {
        const zonalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
        if (!zonalCoordinatorUser) {
            return res.status(400).json({
                message: "Zonal Coordinator not found",
            });
        }
        sanitizedBody.zonalCoordinator = zonalCoordinatorUser._id;
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

    const zone = new Zone(sanitizedBody);
    await zone.save();
    res.status(201).json({
        message: "Zone created successfully",
        zone,
    });
});

export const getZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const zone = await Zone.findById(id).populate('region regionalCoordinator zonalCoordinator evngCoordinators allMembers subZones fellowships');
    if (!zone) {
        return res.status(404).json({
            message: "Zone not found",
        });
    }
    res.json({
        message: "Zone found",
        zone,
    });
});

export const getAllZones = TryCatch(async (req, res) => {
    const zones = await Zone.find().populate('region regionalCoordinator zonalCoordinator evngCoordinators allMembers subZones fellowships');
    res.json({
        message: "Zones found",
        zones,
    });
});

export const updateZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    // Find region if provided
    if (sanitizedBody.region) {
        const region = await Region.findById(sanitizedBody.region);
        if (!region) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
    }

    // Find regionalCoordinator if provided
    if (sanitizedBody.regionalCoordinator) {
        const regionalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.regionalCoordinator });
        if (!regionalCoordinatorUser) {
            return res.status(400).json({
                message: "Regional Coordinator not found",
            });
        }
        sanitizedBody.regionalCoordinator = regionalCoordinatorUser._id;
    }

    // Find zonalCoordinator if provided
    if (sanitizedBody.zonalCoordinator) {
        const zonalCoordinatorUser = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
        if (!zonalCoordinatorUser) {
            return res.status(400).json({
                message: "Zonal Coordinator not found",
            });
        }
        sanitizedBody.zonalCoordinator = zonalCoordinatorUser._id;
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

    const zone = await Zone.findByIdAndUpdate(id, sanitizedBody, {
        new: true,
        runValidators: true,
    }).populate('region regionalCoordinator zonalCoordinator evngCoordinators allMembers subZones fellowships');
    if (!zone) {
        return res.status(404).json({
            message: "Zone not found",
        });
    }
    res.json({
        message: "Zone updated successfully",
        zone,
    });
});

export const deleteZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const zone = await Zone.findById(id);
    if (!zone) {
        return res.status(404).json({
            message: "Zone not found",
        });
    }

    if (zone.totalMembers > 0) {
        return res.status(400).json({
            message: "Cannot delete zone with members",
        });
    }
    await Zone.findByIdAndDelete(id);
    res.json({
        message: "Zone deleted successfully",
    });
});