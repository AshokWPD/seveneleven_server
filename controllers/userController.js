const User = require("../models/userModel");
const { Op } = require("sequelize");
const { generateOTP, sendOTPByEmail } = require("../utils/otpUtils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendResponse, sendError } = require("../utils/responseHelper");
const UserDetails = require("../models/userDetails");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.validatedBody);

    const userDetails = await UserDetails.findOne({
      where: { userId: user.id },
    });

    if (!userDetails) {
      await UserDetails.create({
        userId: user.id, // or null if allowed
        address: "",
        state: "",
        city: "",
        pincode: "",
        isAllowWhatsapp: false,
        allowNotification: true,
        searchHistory: [], // assuming this is a JSON field
        lastSeenService: [],
        favorites: [], // assuming this is a JSON field
      });
    }

    return sendResponse(res, "User created successfully", true, user, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

exports.loginUser = async (req, res) => {
  const { userEmail, phoneNumber } = req.body; // `identifier` could be email or phone number

  try {
    const whereClause = phoneNumber ? { phoneNumber } : { userEmail };

    // Find user by either email or phoneNumber
    let user = await User.findOne({
      where: whereClause,
    });

    if (!user) {
      user = await User.create({
        username: "Guest",
        userEmail,
        type: 1,
        isAllowed: true,
        phoneNumber,
      });

      const userDetails = await UserDetails.findOne({
        where: { userId: user.id },
      });

      if (!userDetails) {
        await UserDetails.create({
          userId: user.id, // or null if allowed
          address: "",
          state: "",
          city: "",
          pincode: "",
          isAllowWhatsapp: false,
          allowNotification: true,
          searchHistory: [], // assuming this is a JSON field
          lastSeenService: [],
          favorites: [], // assuming this is a JSON field
        });
      }

      return sendResponse(res, "User created successful", true, {
        newuser: true,
      });

      // return sendResponse(res, "Invalid email/phone number", false, null, 401);
    } else {
      const otp = generateOTP(); // Generate a 6-digit OTP
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 3 * 60000); // 3-minute expiry
      await user.save();

      sendOTP(res, otp, user.phoneNumber, user.userEmail, user.username);
    }

    // Send back the user and token
    // return sendResponse(res, "Login successful", true, { uKey: token });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "An error occurred while logging in");
  }
};

exports.newUserEntry = async (req, res) => {
  const { userEmail, phoneNumber, username, isAllowWhatsapp } = req.body; // `identifier` could be email or phone number

  try {
    let user = null;

    // First, try to find user by phone number
    if (phoneNumber) {
      user = await User.findOne({ where: { phoneNumber } });
    }

    // If not found by phone number, try with email
    if (!user && userEmail) {
      user = await User.findOne({ where: { userEmail } });
    }

    if (!user) {
      user = await User.create({
        username,
        userEmail,
        type: 1,
        isAllowed: true,
        phoneNumber,
      });

      const userDetails = await UserDetails.findOne({
        where: { userId: user.id },
      });

      if (!userDetails) {
        await UserDetails.create({
          userId: user.id, // or null if allowed
          address: "",
          state: "",
          city: "",
          pincode: "",
          isAllowWhatsapp,
          allowNotification: true,
          searchHistory: [], // assuming this is a JSON field
          lastSeenService: [],
          favorites: [], // assuming this is a JSON field
        });
      }

      // return sendResponse(res, "Invalid email/phone number", false, null, 401);
    } else {
      user.update({
        username,
        userEmail: userEmail || user.userEmail,
        phoneNumber: phoneNumber || user.phoneNumber,
      });

      const userDetails = await UserDetails.findOne({
        where: { userId: user.id },
      });

      if (!userDetails) {
        await UserDetails.create({
          userId: user.id, // or null if allowed
          address: "",
          state: "",
          city: "",
          pincode: "",
          isAllowWhatsapp,
          allowNotification: true,
          searchHistory: [], // assuming this is a JSON field
          lastSeenService: [],
          favorites: [], // assuming this is a JSON field
        });
      } else {
        await userDetails.update({
          isAllowWhatsapp,
        });
      }

      const otp = generateOTP(); // Generate a 6-digit OTP
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 3 * 60000); // 3-minute expiry
      await user.save();

      sendOTP(res, otp, user.phoneNumber, user.userEmail, user.username);
    }

    // Send back the user and token
    // return sendResponse(res, "Login successful", true, { uKey: token });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "An error occurred while logging in");
  }
};

exports.userresendOTP = async (req, res) => {
  const { userEmail, phoneNumber } = req.body; // `identifier` could be email or phone number

  try {
    let user = null;

    // First, try to find user by phone number
    if (phoneNumber) {
      user = await User.findOne({ where: { phoneNumber } });
    }

    // If not found by phone number, try with email
    if (!user && userEmail) {
      user = await User.findOne({ where: { userEmail } });
    }

    if (!user) {
      return sendError(res, "User not exist");

      // return sendResponse(res, "Invalid email/phone number", false, null, 401);
    } else {
      const otp = generateOTP(); // Generate a 6-digit OTP
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 3 * 60000); // 3-minute expiry
      await user.save();

      sendOTP(res, otp, user.phoneNumber, user.userEmail, user.username);
    }

    // Send back the user and token
    // return sendResponse(res, "Login successful", true, { uKey: token });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "An error occurred while logging in");
  }
};

// Update an existing user by ID
exports.editUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve the user by ID
    const user = await User.findByPk(id);

    // If the user doesn't exist, return a 404 error
    if (!user) {
      return sendResponse(res, "User not found", false, null, 404);
    }

    // Only update the fields that are provided in req.body
    const updatedUser = await user.update(req.validatedBody);

    // Respond with the updated user details
    return sendResponse(res, "User updated successfully", true, updatedUser);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// Get User by ID, Email or Mobile
exports.getUser = async (req, res) => {
  const { id, email, phoneNumber } = req.query;
  const whereClause = {};

  if (id) whereClause.id = id;
  if (email) whereClause.userEmail = email;
  if (phoneNumber) whereClause.phoneNumber = phoneNumber;

  if (Object.keys(whereClause).length === 0) {
    return sendResponse(
      res,
      "No valid query parameters provided",
      false,
      null,
      400
    );
  }

  try {
    const user = await User.findOne({ where: whereClause });
    if (!user) {
      return sendResponse(res, "User not found", false, null, 404);
    }
    return sendResponse(res, "User fetched successfully", true, user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Get All Users with Filters
exports.getAllUsers = async (req, res) => {
  const { type, limit = 10, page = 1 } = req.query;
  const filters = {};
  if (type) filters.type = type;

  try {
    const users = await User.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    return sendResponse(res, "Users fetched successfully", true, {
      total: users.count,
      pages: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Search Users
exports.searchUsers = async (req, res) => {
  const { query, type, limit = 10, page = 1 } = req.query;

  const filters = {
    [Op.or]: [
      { userEmail: { [Op.like]: `%${query}%` } },
      { username: { [Op.like]: `%${query}%` } },
      { phoneNumber: { [Op.like]: `%${query}%` } },
      { gender: { [Op.like]: `%${query}%` } },
      { address: { [Op.like]: `%${query}%` } },
      { location: { [Op.like]: `%${query}%` } },
    ],
  };
  if (type) filters.type = type;

  try {
    const users = await User.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    return sendResponse(res, "users get successfully", true, {
      total: users.count,
      pages: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.destroy({ where: { id } });
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    return sendResponse(res, "User deleted successfully", true, user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Send OTP for phone or email
const sendOTP = async (res, otp, phoneNumber, userEmail, username) => {
  try {
    // if (phoneNumber) {
    //   await sendOTPBySMS(phoneNumber, otp);
    // }
    if (userEmail) {
      await sendOTPByEmail(userEmail, otp);
    }

    return sendResponse(
      res,
      "OTP send successful",
      true,
      username == "Guest" ? { newuser: true } : { newuser: false }
    );
  } catch (error) {
    return sendError(res, `Error sending OTP: ${error}`, 500);
  }
};

// Verify OTP for phone or email
exports.verifyOTP = async (req, res) => {
  const { username, phoneNumber, userEmail, otp } = req.body;
  try {
    const whereClause = phoneNumber ? { phoneNumber } : { userEmail };
    const user = await User.findOne({ where: whereClause });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.otp !== otp) {
      return sendError(res, error.message, 500);
    }
    if (user.otpExpiresAt < new Date()) {
      return sendError(res, error.message, 500);
    }

    // Reset OTP fields
    user.otp = null;
    user.otpExpiresAt = null;
    user.username = username || user.username;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.userEmail = userEmail || user.userEmail;

    await user.save();

    const token = jwt.sign(
      { userId: user.id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "70d" }
    );

    return sendResponse(res, "OTP verified successfully", true, {
      user: user,
      ukey: token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return sendError(res, error.message, 500);
  }
};

// authController.js
exports.validateToken = (req, res) => {
  // If we reach here, it means the token was valid and user information is in req.user
  return sendResponse(res, "Token is valid", true, req.user);
};

// Controller to retrieve user data based on the token
exports.getUserData = async (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return sendError(res, "Access denied. No token provided.", 403);
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Return user data
    return sendResponse(res, "user get successfully", true, user);
  } catch (error) {
    return sendError(res, "Invalid or expired token", 403);
  }
};

// Controller to decode the token without verifying it
exports.unsignToken = (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return sendError(res, "Access denied. No token provided.", 403);
  }

  try {
    // Decode token without verifying
    const decoded = jwt.decode(token);

    if (!decoded) {
      return sendError(res, "Invalid token", 400);
    }

    // Return decoded token data
    return sendResponse(res, "Unsign successfully", true, decoded);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
