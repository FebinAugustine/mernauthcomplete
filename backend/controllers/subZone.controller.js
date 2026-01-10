
import { Subzone } from '../models/subZone.model.js';
import { User } from '../models/User.js';
import { Region } from '../models/region.model.js';
import TryCatch from '../middlewares/TryCatch.js';
import sanitize from 'mongo-sanitize';

export const createSubZone = TryCatch(async (req, res) => {
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

    // find the zonalCoordinator and evngCoordinator by zionId
    const zonalCoordinator = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
    const evngCoordinator = await User.findOne({ zionId: sanitizedBody.evngCoordinator });
    if (!zonalCoordinator || !evngCoordinator) {
        return res.status(400).json({
            message: "Zonal Coordinator or Evening Coordinator not found",
        });
    }

    // get the mongodb IDs of the zonalCoordinator and evngCoordinator
    sanitizedBody.zonalCoordinator = zonalCoordinator._id;
    sanitizedBody.evngCoordinator = evngCoordinator._id;

    // create the SubZone with sanitized data and save to database
    const subZone = new Subzone(sanitizedBody);

    await subZone.save();
    res.status(201).json({
        message: "SubZone created successfully",
        subZone,
    });
});

export const getSubZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const subZone = await Subzone.findById(id).populate('zonalCoordinator evngCoordinator allMembers fellowships');
    if (!subZone) {
        return res.status(404).json({
            message: "SubZone not found",
        });
    }
    res.json({
        message: "SubZone found",
        subZone,
    });
});

export const getAllSubZones = TryCatch(async (req, res) => {
    const subZones = await Subzone.find().populate('zonalCoordinator evngCoordinator allMembers fellowships zone region');
    res.json({
        message: "SubZones found",
        subZones,
    });
});

export const updateSubZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    // If region is provided, find by id
    if (sanitizedBody.region) {
        const region = await Region.findById(sanitizedBody.region);
        if (!region) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
    }

    // If zonalCoordinator is provided, find by zionId and replace with _id
    if (sanitizedBody.zonalCoordinator) {
        const zonalCoordinator = await User.findOne({ zionId: sanitizedBody.zonalCoordinator });
        if (!zonalCoordinator) {
            return res.status(400).json({
                message: "Zonal Coordinator not found",
            });
        }
        sanitizedBody.zonalCoordinator = zonalCoordinator._id;
    }

    // If evngCoordinator is provided, find by zionId and replace with _id
    if (sanitizedBody.evngCoordinator) {
        const evngCoordinator = await User.findOne({ zionId: sanitizedBody.evngCoordinator });
        if (!evngCoordinator) {
            return res.status(400).json({
                message: "Evening Coordinator not found",
            });
        }
        sanitizedBody.evngCoordinator = evngCoordinator._id;
    }

    const subZone = await Subzone.findByIdAndUpdate(id, sanitizedBody, {
        new: true,
        runValidators: true,
    }).populate('zonalCoordinator evngCoordinator allMembers fellowships');
    if (!subZone) {
        return res.status(404).json({
            message: "SubZone not found",
        });
    }
    res.json({
        message: "SubZone updated successfully",
        subZone,
    });
});

export const deleteSubZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const subZone = await Subzone.findById(id);
    if (!subZone) {
        return res.status(404).json({
            message: "SubZone not found",
        });
    }
    if (subZone.totalMembers > 0) {
        return res.status(400).json({
            message: "Cannot delete SubZone with members",
        });
    }
    await Subzone.findByIdAndDelete(id);
    res.json({
        message: "SubZone deleted successfully",
    });
});