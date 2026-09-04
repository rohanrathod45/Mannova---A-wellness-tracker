const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mood: {
      type: String,
      enum: [
        "Happy",
        "Sad",
        "Angry",
        "Stressed",
        "Anxious",
        "Calm",
        "Excited",
        "Neutral",
      ],
      default: "Neutral",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Journal", journalSchema);