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
    const positiveReports = await Report.countDocuments({ sentiment: 'positive' });
    const negativeReports = await Report.countDocuments({ sentiment: 'negative' });
    const neutralReports = await Report.countDocuments({ sentiment: 'neutral' });

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
    const users = await User.find()
        .populate('fellowship', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
    const usersWithCounts = users.map(user => ({
        _id: user._id,
        name: user.name,
        fellowship: user.fellowship?.name || '',
        totalReports: user.reports.length,
    }));
    const total = await User.countDocuments();
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
    const users = await User.find()
        .populate('fellowship', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await User.countDocuments();
    res.json({
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});