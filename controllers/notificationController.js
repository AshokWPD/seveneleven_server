const Notification = require("../models/userNotificationModel");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");



// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const newNotification = await Notification.create(req.validatedBody);
    sendResponse(res, "Notification created successfully", true, newNotification, 201);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to create notification");
  }
};

// Edit Notification
exports.editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) return sendError(res, "Notification not found", 404);

    const updatedNotification = await notification.update(req.validatedBody);
    sendResponse(res, "Notification updated successfully", true, updatedNotification);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to update notification");
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) return sendError(res, "Notification not found", 404);

    await notification.destroy();
    sendResponse(res, "Notification deleted successfully");
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to delete notification");
  }
};

// Get Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) return sendError(res, "Notification not found", 404);

    sendResponse(res, "Notification fetched successfully", true, notification);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch notification");
  }
};

// Get All Notifications (with optional search and pagination)
exports.getAllNotifications = async (req, res) => {
  try {
    const { userId, search, type, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (userId) filters.userId = userId;
    if (type) filters.type = type;
    if (search) {
      filters.title = { [Op.like]: `%${search}%` };
    }

    const notifications = await Notification.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["id", "DESC"]],
    });

    sendResponse(res, "Notifications fetched successfully", true, {
      total: notifications.count,
      pages: Math.ceil(notifications.count / limit),
      data: notifications.rows,
    });
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch notifications");
  }
};



// Get My Notifications (based on JWT token)
exports.getMyNotifications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return sendError(res, "Token missing", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const notifications = await Notification.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    });

    sendResponse(res, "Your notifications fetched successfully", true, notifications);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch your notifications");
  }
};

// Mark a Notification as Read
exports.markNotificationsAsRead = async (req, res) => {
  try {
    const { ids = [] } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, "No notification IDs provided", 400);
    }

    const updatedCount = await Notification.update(
      { isRead: true },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    sendResponse(res, "Notifications marked as read", true, {
      updated: updatedCount[0], // number of updated rows
      ids,
    });
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to mark notifications as read");
  }
};
