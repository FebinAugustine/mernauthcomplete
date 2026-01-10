import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { User } from "../models/User.js";
import { Fellowship } from "../models/Fellowship.model.js";
import { Subzone } from "../models/subZone.model.js";
import { Zone } from "../models/zone.model.js";
import { Region } from "../models/region.model.js";
import { Report } from "../models/Report.model.js";

export const getDashboardStats = TryCatch(async (req, res) => {
    const totalRegions = await Region.countDocuments();
    const totalZones = await Zone.countDocuments();
    const totalSubzones = await Subzone.countDocuments();
    const totalFellowships = await Fellowship.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const positiveReports = await Report.countDocuments({ status: 'Positive' });
    const negativeReports = await Report.countDocuments({ status: 'Negative' });
    const neutralReports = await Report.countDocuments({ status: 'Neutral' });

    // Count coordinators by role
    const totalCoordinators = await User.countDocuments({ role: 'cordinator' });
    const totalEvngCoordinators = await User.countDocuments({ role: 'evngcordinator' });
    const totalZonalCoordinators = await User.countDocuments({ role: 'zonal' });
    const totalRegionalCoordinators = await User.countDocuments({ role: 'regional' });

    res.json({
        totalRegions,
        totalZones,
        totalSubzones,
        totalFellowships,
        totalUsers,
        totalReports,
        positiveReports,
        negativeReports,
        neutralReports,
        totalCoordinators,
        totalEvngCoordinators,
        totalZonalCoordinators,
        totalRegionalCoordinators,
    });
});

export const getSubzonesPaginated = TryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subzones = await Subzone.find()
        .populate('zonalCoordinator', 'name')
        .populate('evngCoordinator', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await Subzone.countDocuments();
    res.json({
        subzones,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

export const getFellowshipsPaginated = TryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const fellowships = await Fellowship.find()
        .populate('coordinator', 'name')
        .populate('evngCoordinator', 'name')
        .populate('zonalCoordinator', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await Fellowship.countDocuments();
    res.json({
        fellowships,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

export const getUsersWithReportsPaginated = TryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({ reports: { $ne: [] } })
        .populate('fellowship', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
    const usersWithCounts = await Promise.all(users.map(async user => ({
        _id: user._id,
        name: user.name,
        fellowship: user.fellowship?.name || '',
        totalReports: await Report.countDocuments({ user: user._id }),
    })));
    const total = await User.countDocuments({ reports: { $ne: [] } });
    res.json({
        users: usersWithCounts,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

export const getUsersPaginated = TryCatch(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }
        : {};

    const users = await User.find(query)
        .populate('fellowship', 'name')
        .populate('subZone', 'name')
        .populate('zone', 'name')
        .populate('region', 'name')
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await User.countDocuments(query);
    res.json({
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

export const updateUserAdmin = TryCatch(async (req, res) => {
    const userId = req.params.id;
    const sanitizedBody = sanitize(req.body);
    const { fellowship, subZone, zone, region, ...updateData } = sanitizedBody;

    // Find fellowship by id if provided
    if (fellowship) {
        const fellowshipDoc = await Fellowship.findById(fellowship);
        if (!fellowshipDoc) {
            return res.status(400).json({
                message: "Fellowship not found",
            });
        }
        updateData.fellowship = fellowshipDoc._id;
    }

    // Find subZone by id if provided
    if (subZone) {
        const subZoneDoc = await Subzone.findById(subZone);
        if (!subZoneDoc) {
            return res.status(400).json({
                message: "SubZone not found",
            });
        }
        updateData.subZone = subZoneDoc._id;
    }

    // Find zone by id if provided
    if (zone) {
        const zoneDoc = await Zone.findById(zone);
        if (!zoneDoc) {
            return res.status(400).json({
                message: "Zone not found",
            });
        }
        updateData.zone = zoneDoc._id;
    }

    // Find region by id if provided
    if (region) {
        const regionDoc = await Region.findById(region);
        if (!regionDoc) {
            return res.status(400).json({
                message: "Region not found",
            });
        }
        updateData.region = regionDoc._id;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
    }).populate('fellowship', 'name').populate('subZone', 'name').populate('zone', 'name').populate('region', 'name');

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    res.json({
        message: "User updated successfully",
        user,
    });
});

export const deleteUserAdmin = TryCatch(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    res.json({
        message: "User deleted successfully",
    });
});