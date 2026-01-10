import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 4,
            maxlength: 50,
        },
        region: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Region",
            // required: true,
        },
        regionalCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        zonalCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        evngCoordinators: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } ],
        totalMembers: {
            type: Number,
            default: 0,
            min: 0,
        },
        allMembers: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } ],
        subZones: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subzone",
        } ],
        fellowships: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fellowship",
        } ],
    },
    { timestamps: true }
);

export const Zone = mongoose.model("Zone", schema);
