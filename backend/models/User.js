import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: [ "user", "zonal", "admin", "evngcordinator", "cordinator" ],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    fellowship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fellowship",
      required: true,

    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      default: 9846123123,
      maxlength: 10,
      minlength: 10
    },
    address: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    zionId: {
      type: Number,
      unique: true,
      default: 0,
      maxlength: 6,
      minlength: 1,
    },
    subZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subzone",
    },

  },
  { timestamps: true }
);

export const User = mongoose.model("User", schema);
