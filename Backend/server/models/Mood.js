// const mongoose = require("mongoose");

// const moodSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     mood: {
//       type: String,
//       required: true,
//       enum: [
//         "Happy",
//         "Sad",
//         "Angry",
//         "Stressed",
//         "Anxious",
//         "Calm",
//         "Excited",
//         "Neutral"
//       ],
//     },

//     note: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Mood", moodSchema);
const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mood: {
      type: String,
      required: true,
      enum: [
        "sad",
        "unhappy",
        "neutral",
        "happy",
        "great",
      ],
    },

    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    tags: {
      type: [String],
      default: [],
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mood", moodSchema);