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
        zone: {
            type: String,
            required: true,
            enum: [ "Kochi", "Ernakulam", "Varappuzha", "Pala", "Zion" ],
            default: "Kochi",
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
            required: true,
            default: 0,
            min: 0,
        },
        allMembers: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } ],
    },
    { timestamps: true }
);

export const Subzone = mongoose.model("Subzone", schema);
