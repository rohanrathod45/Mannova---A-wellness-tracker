const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "therapist", "admin"],
      default: "user",
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    language: {
      type: String,
      default: "English",
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    membership: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    notifications: {
      dailyReminder: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: false },
      exerciseAlerts: { type: Boolean, default: true },
    },

    privacy: {
      shareWithTherapist: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false },
      anonymousData: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);