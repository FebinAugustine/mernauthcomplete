import mongoose from "mongoose";
import { de } from "zod/v4/locales";

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 4,
            maxlength: 50,
        },
        zones: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
        },
        regionalCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        zonalCoordinators: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        } ],
        evngCoordinators: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
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

export const Region = mongoose.model("Region", schema);
