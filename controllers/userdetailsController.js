const { UserDetails, User } = require("../models/models");
const { sendResponse, sendError } = require("../utils/responseHelper");

// Create User Details
exports.createUserDetails = async (req, res) => {
  try {
    const userDetails = await UserDetails.create(req.validatedBody);
    return sendResponse(
      res,
      "User details created successfully",
      true,
      userDetails,
      201
    );
  } catch (error) {
    return sendError(res, "Failed to create user details", 500, error.message);
  }
};

// Update User Details by userId
exports.updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const [updated] = await UserDetails.update(req.validatedBody, {
      where: { userId },
    });

    if (updated) {
      const updatedDetails = await UserDetails.findOne({
        where: { userId },
      });
      return sendResponse(
        res,
        "User details updated successfully",
        true,
        updatedDetails
      );
    } else {
      return sendError(res, "User details not found", 404);
    }
  } catch (error) {
    return sendError(res, "Failed to update user details", 500, error.message);
  }
};

// Get User Details by ID
exports.getUserDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDetails = await UserDetails.findOne({ where: { userId } });

    if (userDetails) {
      return sendResponse(
        res,
        "User details retrieved successfully",
        true,
        userDetails
      );
    } else {
      return sendError(res, "User details not found", 404);
    }
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve user details",
      500,
      error.message
    );
  }
};

// Get All User Details
exports.getAllUserDetails = async (req, res) => {
  try {
    const allDetails = await UserDetails.findAll();
    return sendResponse(
      res,
      "All user details retrieved successfully",
      true,
      allDetails
    );
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve all user details",
      500,
      error.message
    );
  }
};

exports.getUserDetailsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDetails = await UserDetails.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "User", // match the association alias if used
          attributes: { exclude: ["otp", "otpExpiresAt"] }, // optional: exclude sensitive fields
        },
      ],
    });

    if (userDetails) {
      return sendResponse(
        res,
        "User details retrieved successfully",
        true,
        userDetails.toJSON()
      );
    } else {
      return sendError(res, "User details not found for this userId", 404);
    }
  } catch (error) {
    return sendError(
      res,
      "Failed to retrieve user details by userId",
      500,
      error.message
    );
  }
};
