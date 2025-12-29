import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        fellowship: {
            type: String,
            required: true,
            enum: [ "Kochi", "Ernakulam", "Varappuzha", "Pala", "Zion" ],
            default: "Kochi",
        },
        typeOfReport: {
            type: String,
            required: true,
            enum: [ "Calling", "DTD", "Card", "Survey", "Personal", "Other" ],
            default: "DTD",
        },
        date: {
            type: Date,
            required: true,
        },

        hearerName: {
            type: String,
            required: true,
        },
        noOfHearers: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
        },
        location: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: Number,
            required: true,
            unique: true,
            default: 9846123123,
            maxlength: 10,
            minlength: 10
        },
        status: {
            type: String,
            required: true,
            enum: [ "Neutral", "Positive", "Negative" ],
            default: "Neutral",
        },
        remarks: {
            type: String,
            default: "",
        },
        followUpStatus: {
            type: String,
            default: "First Contact",
            enum: [ "First Contact", "Second Contact", "Third Contact", "Ready", "Attended" ],
        },
        nextFollowUpDate: {
            type: Date,
            default: null,
        },
        followUpRemarks: {
            type: String,
            default: "",
        },
        appointmentDate: {
            type: Date,
            default: null,
        },
        appointmentTime: {
            type: String,
            default: "",
        },
        appointmentLocation: {
            type: String,
            default: "",
        },
        appointmentStatus: {
            type: String,
            default: "Not Scheduled",
            enum: [ "Not Scheduled", "Scheduled", "Completed", "Cancelled" ],
        },
        evangelistAssigned: {
            type: String,
            default: "",
        },
        appointmentRemarks: {
            type: String,
            default: "",
        },


    },
    { timestamps: true }
);

export const Report = mongoose.model("Report", schema);
