const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authorizeRoles = require("../middleware/roleAuth");
const validate = require("../middleware/validate");

const {
  createNotificationSchema,
  editNotificationSchema,
} = require("../validators/notificationValidators");

// Create Notification
router.post(
  "/A/createNotification",
  validate(createNotificationSchema),
  authorizeRoles(3),
  notificationController.createNotification
);

// Edit Notification
router.put(
  "/UV/editNotification/:id",
  validate(editNotificationSchema),
  authorizeRoles(1, 2, 3),
  notificationController.editNotification
);

// Delete Notification
router.delete(
  "/A/deleteNotification/:id",
  authorizeRoles(3),
  notificationController.deleteNotification
);

// Get by ID
router.get(
  "/A/getNotification/:id",
  authorizeRoles(3),
  notificationController.getNotificationById
);

// Get all (with filters)
router.get(
  "/UV/getAllNotifications",
  authorizeRoles(1, 2, 3),
  notificationController.getAllNotifications
);


// Get My Notifications (based on JWT token)
router.get(
  "/UV/getMyNotifications",
  authorizeRoles(1, 2),
  notificationController.getMyNotifications
);

// Mark Notification as Read
// Mark multiple notifications as read
router.put(
  "/UV/markNotificationsAsRead",
  authorizeRoles(1, 2, 3),
  notificationController.markNotificationsAsRead
);

module.exports = router;
