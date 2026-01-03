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
        subzone: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 50,
            enum: [
                "Thevara", "FortKochi", "Ernakulam1", "Ernakulam2",
                "Varappuzha1", "Varappuzha2", "Pala1", "Pala2", "Zion1", "Zion2"
            ],
        },
        coordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
        evngCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },
        zonalCoordinator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },
        totalMembers: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        address: {
            type: String,
            default: "",
        },
        allMembers: [ {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        } ],
    },
    { timestamps: true }
);

export const Fellowship = mongoose.model("Fellowship", schema);
