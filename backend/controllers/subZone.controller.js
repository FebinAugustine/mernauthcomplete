
// Sub zone controller
const SubZone = require('../models/subZone.model');

const TryCatch = require('../middlewares/TryCatch');
const sanitize = require('mongo-sanitize');

export const createSubZone = TryCatch(async (req, res) => {
    const sanitezedBody = sanitize(req.body);
    const subZone = new SubZone(sanitezedBody);
    await subZone.save();
    res.status(201).json({
        message: "SubZone created successfully",
        subZone,
    });
});

export const getSubZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const subZone = await SubZone.findById(id);
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

export const updateSubZone = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitezedBody = sanitize(req.body);
    const subZone = await SubZone.findByIdAndUpdate(id, sanitezedBody, {
        new: true,
        runValidators: true,
    });
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
    const subZone = await SubZone.findByIdAndDelete(id);
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
    res.json({
        message: "SubZone deleted successfully",
    });
});