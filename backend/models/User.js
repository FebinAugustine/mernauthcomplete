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
      type: String,
      default: "fellowship",
      required: true,
      enum: [ "FortKochi", "Thevara", "Palarivattom", "Thoppumpady", "Palluruthi", "Perumpadappu", "Kannamaly", "Kumbalangi", "Kattiparambu" ],
      length: 20,
      maxlength: 20,
      minlength: 4,
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
    zone: {
      type: String,
      default: "",
    },
    subZone: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

export const User = mongoose.model("User", schema);
