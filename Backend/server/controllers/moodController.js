// // const Mood = require("../models/Mood");

// // // ==============================
// // // Create Mood
// // // POST /api/moods
// // // ==============================
// // const createMood = async (req, res) => {
// //     try {
// //         const mood = await Mood.create(req.body);

// //         res.status(201).json({
// //             success: true,
// //             message: "Mood added successfully",
// //             data: mood
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // ==============================
// // // Get All Moods
// // // GET /api/moods
// // // ==============================
// // const getAllMoods = async (req, res) => {
// //     try {
// //         const moods = await Mood.find().populate("userId", "fullName email");

// //         res.status(200).json({
// //             success: true,
// //             count: moods.length,
// //             data: moods
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // ==============================
// // // Get Single Mood
// // // GET /api/moods/:id
// // // ==============================
// // const getMoodById = async (req, res) => {
// //     try {
// //         const mood = await Mood.findById(req.params.id)
// //             .populate("userId", "fullName email");

// //         if (!mood) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Mood not found"
// //             });
// //         }

// //         res.status(200).json({
// //             success: true,
// //             data: mood
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // ==============================
// // // Update Mood
// // // PUT /api/moods/:id
// // // ==============================
// // const updateMood = async (req, res) => {
// //     try {
// //         const mood = await Mood.findByIdAndUpdate(
// //             req.params.id,
// //             req.body,
// //             {
// //                 new: true,
// //                 runValidators: true
// //             }
// //         );

// //         if (!mood) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Mood not found"
// //             });
// //         }

// //         res.status(200).json({
// //             success: true,
// //             message: "Mood updated successfully",
// //             data: mood
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // // ==============================
// // // Delete Mood
// // // DELETE /api/moods/:id
// // // ==============================
// // const deleteMood = async (req, res) => {
// //     try {
// //         const mood = await Mood.findByIdAndDelete(req.params.id);

// //         if (!mood) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Mood not found"
// //             });
// //         }

// //         res.status(200).json({
// //             success: true,
// //             message: "Mood deleted successfully"
// //         });

// //     } catch (error) {
// //         res.status(500).json({
// //             success: false,
// //             message: error.message
// //         });
// //     }
// // };

// // module.exports = {
// //     createMood,
// //     getAllMoods,
// //     getMoodById,
// //     updateMood,
// //     deleteMood
// // };

// const Mood = require("../models/Mood");


// // ========================================
// // Create Mood
// // POST /api/moods
// // ========================================

// const createMood = async (req, res) => {
//     try {

//         const { mood, note } = req.body;

//         // Validate mood
//         if (!mood) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Mood is required"
//             });
//         }

//         // Create mood using the logged-in user's ID
//         const newMood = await Mood.create({
//             userId: req.user.id,
//             mood,
//             note
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Mood added successfully",
//             data: newMood
//         });

//     } catch (error) {

//         console.error("Create Mood Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ========================================
// // Get All Moods
// // GET /api/moods
// // ========================================

// const getAllMoods = async (req, res) => {
//     try {

//         // Only get moods belonging to logged-in user
//         const moods = await Mood.find({
//             userId: req.user.id
//         })
//             .populate("userId", "fullName email")
//             .sort({ createdAt: -1 });

//         return res.status(200).json({
//             success: true,
//             count: moods.length,
//             data: moods
//         });

//     } catch (error) {

//         console.error("Get Moods Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ========================================
// // Get Single Mood
// // GET /api/moods/:id
// // ========================================

// const getMoodById = async (req, res) => {
//     try {

//         const mood = await Mood.findOne({
//             _id: req.params.id,
//             userId: req.user.id
//         })
//             .populate("userId", "fullName email");

//         if (!mood) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Mood not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: mood
//         });

//     } catch (error) {

//         console.error("Get Mood Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ========================================
// // Update Mood
// // PUT /api/moods/:id
// // ========================================

// const updateMood = async (req, res) => {
//     try {

//         const { mood, note } = req.body;

//         const updatedMood = await Mood.findOneAndUpdate(
//             {
//                 _id: req.params.id,
//                 userId: req.user.id
//             },
//             {
//                 mood,
//                 note
//             },
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         if (!updatedMood) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Mood not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Mood updated successfully",
//             data: updatedMood
//         });

//     } catch (error) {

//         console.error("Update Mood Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ========================================
// // Delete Mood
// // DELETE /api/moods/:id
// // ========================================

// const deleteMood = async (req, res) => {
//     try {

//         const mood = await Mood.findOneAndDelete({
//             _id: req.params.id,
//             userId: req.user.id
//         });

//         if (!mood) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Mood not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Mood deleted successfully"
//         });

//     } catch (error) {

//         console.error("Delete Mood Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// module.exports = {
//     createMood,
//     getAllMoods,
//     getMoodById,
//     updateMood,
//     deleteMood
// };

const Mood = require("../models/Mood");

// ========================================
// Create Mood
// POST /api/moods
// ========================================

const createMood = async (req, res) => {
  try {
    const {
      mood,
      intensity,
      tags,
      note
    } = req.body;

    // Validate mood
    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "Mood is required",
      });
    }

    // Validate intensity
    if (
      intensity === undefined ||
      intensity < 1 ||
      intensity > 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Intensity must be between 1 and 10",
      });
    }

    const newMood = await Mood.create({
      userId: req.user.id,
      mood,
      intensity: Number(intensity),
      tags: Array.isArray(tags) ? tags : [],
      note: note || "",
    });

    return res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      data: newMood,
    });

  } catch (error) {
    console.error("Create Mood Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Get Logged-in User's Moods
// GET /api/moods
// ========================================

const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: moods.length,
      data: moods,
    });

  } catch (error) {
    console.error("Get Moods Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Get Single Mood
// GET /api/moods/:id
// ========================================

const getMoodById = async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: "Mood not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: mood,
    });

  } catch (error) {
    console.error("Get Mood Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Update Mood
// PUT /api/moods/:id
// ========================================

const updateMood = async (req, res) => {
  try {
    const {
      mood,
      intensity,
      tags,
      note
    } = req.body;

    const updatedMood = await Mood.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        mood,
        intensity: Number(intensity),
        tags: Array.isArray(tags) ? tags : [],
        note: note || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMood) {
      return res.status(404).json({
        success: false,
        message: "Mood not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mood updated successfully",
      data: updatedMood,
    });

  } catch (error) {
    console.error("Update Mood Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Delete Mood
// DELETE /api/moods/:id
// ========================================

const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!mood) {
      return res.status(404).json({
        success: false,
        message: "Mood not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mood deleted successfully",
    });

  } catch (error) {
    console.error("Delete Mood Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createMood,
  getAllMoods,
  getMoodById,
  updateMood,
  deleteMood,
};