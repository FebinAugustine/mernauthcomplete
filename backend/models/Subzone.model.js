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
        region: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Region",
            required: true,
        },
        zone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Zone",
            required: true,
        },
        zonalCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        evngCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalMembers: {
            type: Number,
            default: 0,
            min: 0,
        },
        allMembers: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } ],
        fellowships: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fellowship",
        } ],
    },
    { timestamps: true }
);

export const Subzone = mongoose.model("Subzone", schema);
