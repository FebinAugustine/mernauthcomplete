import TryCatch from "../middlewares/TryCatch.js";
import { User } from "../models/User.js";
import { Fellowship } from "../models/Fellowship.model.js";
import { Subzone } from "../models/subZone.model.js";
import { Report } from "../models/Report.model.js";

export const getDashboardStats = TryCatch(async (req, res) => {
    const totalSubzones = await Subzone.countDocuments();
    const totalFellowships = await Fellowship.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const positiveReports = await Report.countDocuments({ status: 'Positive' });
    const negativeReports = await Report.countDocuments({ status: 'Negative' });
    const neutralReports = await Report.countDocuments({ status: 'Neutral' });

    res.json({
        totalSubzones,
        totalFellowships,
        totalUsers,
        totalReports,
        positiveReports,
        negativeReports,
        neutralReports,
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