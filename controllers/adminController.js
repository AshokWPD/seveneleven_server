const Admin = require("../models/adminModel");
const { Op } = require("sequelize");
const { generateOTP, sendOTPByEmail } = require("../utils/otpUtils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendResponse, sendError } = require("../utils/responseHelper");

exports.createAdmin = async (req, res) => {
  try {
    const user = await Admin.create(req.validatedBody);

    return sendResponse(res, "Admin created successfully", true, user, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

exports.loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await Admin.findOne({
      where: {
        [Op.or]: [{ userEmail: identifier }, { phoneNumber: identifier }],
      },
    });

    if (!user || user.password !== password) {
      return sendResponse(
        res,
        "Invalid email/phone number or password",
        false,
        null,
        401
      );
    }

    const token = jwt.sign(
      { userId: user.id, type: 3 },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "70d" }
    );

    return sendResponse(res, "Login successful", true, { user, uKey: token });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "An error occurred while logging in");
  }
};

exports.editAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Admin.findByPk(id);

    if (!user) {
      return sendResponse(res, "Admin not found", false, null, 404);
    }

    const updatedAdmin = await user.update(req.validatedBody);

    return sendResponse(res, "Admin updated successfully", true, updatedAdmin);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

exports.getAdmin = async (req, res) => {
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
    const user = await Admin.findOne({ where: whereClause });
    if (!user) {
      return sendResponse(res, "Admin not found", false, null, 404);
    }
    return sendResponse(res, "Admin fetched successfully", true, user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.getAllAdmins = async (req, res) => {
  const { type, limit = 10, page = 1 } = req.query;
  const filters = {};
  if (type) filters.type = type;

  try {
    const users = await Admin.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    return sendResponse(res, "Admins fetched successfully", true, {
      total: users.count,
      pages: Math.ceil(users.count / limit),
      data: users.rows,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.searchAdmins = async (req, res) => {
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
    const users = await Admin.findAndCountAll({
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

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Admin.destroy({ where: { id } });
    if (!user) {
      return sendError(res, "Admin not found", 404);
    }

    return sendResponse(res, "Admin deleted successfully", true, user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.forgotPassword = async (req, res) => {
  const { identifier } = req.params;
  try {
    const user = await Admin.findOne({
      where: {
        [Op.or]: [{ userEmail: identifier }, { phoneNumber: identifier }],
      },
    });

    if (!user) {
      return sendError(res, "Admin not found", 404);
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 3 * 60000);
    await user.save();

    await sendOTPByEmail(user.userEmail, otp);
    return sendResponse(res, "OTP sent successfully", true, otp);
  } catch (error) {
    console.error("Error sending OTP for forgot password:", error);
    return sendError(res, error.message, 500);
  }
};

exports.verifyOTP = async (req, res) => {
  const { phoneNumber, userEmail, otp } = req.body;
  try {
    const whereClause = phoneNumber ? { phoneNumber } : { userEmail };
    const user = await Admin.findOne({ where: whereClause });

    if (!user) {
      return sendError(res, "Admin not found", 404);
    }

    if (user.otp !== otp) {
      return sendError(res, error.message, 500);
    }
    if (user.otpExpiresAt < new Date()) {
      return sendError(res, error.message, 500);
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    return sendResponse(res, "OTP verified successfully", true);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return sendError(res, error.message, 500);
  }
};

exports.updatePassword = async (req, res) => {
  const { phoneNumber, userEmail, newPassword } = req.body;
  try {
    const whereClause = phoneNumber ? { phoneNumber } : { userEmail };
    const user = await Admin.findOne({ where: whereClause });

    if (!user) {
      return sendError(res, "Admin not found", 404);
    }

    user.password = newPassword;
    await user.save();
    return sendResponse(res, "Password updated successfully", true);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.validateToken = (req, res) => {
  return sendResponse(res, "Token is valid", true, req.user);
};

exports.getAdminData = async (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return sendError(res, "Access denied. No token provided.", 403);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await Admin.findByPk(userId);
    if (!user) {
      return sendError(res, "Admin not found", 404);
    }

    return sendResponse(res, "user get successfully", true, user);
  } catch (error) {
    return sendError(res, "Invalid or expired token", 403);
  }
};

exports.unsignToken = (req, res) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return sendError(res, "Access denied. No token provided.", 403);
  }

  try {
    const decoded = jwt.decode(token);

    if (!decoded) {
      return sendError(res, "Invalid token", 400);
    }

    return sendResponse(res, "Unsign successfully", true, decoded);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
