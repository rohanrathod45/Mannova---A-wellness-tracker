const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================================
// SIGNUP
// POST /api/auth/signup
// ========================================

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password
    } = req.body;

    // Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email and password are required"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters"
      });
    }

    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();

    // Check existing user
    const existingUser =
      await User.findOne({
        email: normalizedEmail
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User already exists with this email"
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",

      // New users don't have a
      // custom profile picture yet
      profileImage: ""
    });

    // Send response
    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",

      user: {
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  language: user.language,
  profileImage: user.profileImage || ""
}
    });

  } catch (error) {
    console.error(
      "Signup Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during signup"
    });
  }
};


// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    // Normalize email
    const normalizedEmail =
      email.trim().toLowerCase();

    // Find user
    const user =
      await User.findOne({
        email: normalizedEmail
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d"
      }
    );

    // Send response
    return res.status(200).json({
      success: true,
      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage:
          user.profileImage || ""
      }
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login"
    });
  }
};


// ========================================
// GET PROFILE
// GET /api/auth/profile
// ========================================

const getProfile = async (req, res) => {
  try {
    const user =
      await User.findById(req.user.id)
        .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error(
      "Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get profile"
    });
  }
};


// ========================================
// UPDATE PROFILE IMAGE
// PUT /api/auth/profile-image
// ========================================

const updateProfileImage = async (
  req,
  res
) => {
  try {
    const {
      profileImage
    } = req.body;

    // Check image
    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message:
          "Profile image is required"
      });
    }

    // Get logged-in user ID
    const userId =
      req.user.id ||
      req.user._id ||
      req.user.userId;

    // Update profile image
    const user =
      await User.findByIdAndUpdate(
        userId,

        {
          profileImage
        },

        {
          new: true,
          runValidators: true
        }
      ).select("-password");

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found"
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message:
        "Profile image updated successfully",

      user
    });

  } catch (error) {
    console.error(
      "Update profile image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile image"
    });
  }
};


// ========================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ========================================

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      language,
      membership,
      notifications,
      privacy,
      bio
    } = req.body;

    const userId = req.user.id || req.user._id || req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (language !== undefined) user.language = language;
    if (membership !== undefined) user.membership = membership;
    if (bio !== undefined) user.bio = bio.trim();

    if (notifications !== undefined) {
      user.notifications = {
        ...user.notifications,
        ...notifications
      };
    }

    if (privacy !== undefined) {
      user.privacy = {
        ...user.privacy,
        ...privacy
      };
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile settings"
    });
  }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  signup,
  login,
  getProfile,
  updateProfileImage,
  updateProfile
};