const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authorizeRoles = require("../middleware/roleAuth");

const validate = require("../middleware/validate");
const {
  createUserSchema,
  editUserSchema,
} = require("../validators/userValidator");

router.post(
  "/A/createUser",
  validate(createUserSchema),
  authorizeRoles(3),
  userController.createUser
);

// Edit User by ID
router.put(
  "/UV/editUser/:id",
  validate(editUserSchema),
  authorizeRoles(1, 2, 3),
  userController.editUserById
);

// Login User
router.post("/login", userController.loginUser);

// New User Entry User
router.post("/newUserEntry", userController.newUserEntry);

//resend otp
router.post("/resendOTP", userController.userresendOTP);

// Get User by ID, Email or Mobile
router.get("/UV/getUser", authorizeRoles(1, 2, 3), userController.getUser);

// Get All Users with Filters
router.get("/A/getAllUsers", authorizeRoles(3), userController.getAllUsers);

// Search Users
router.get("/A/search", authorizeRoles(3), userController.searchUsers);

// Delete User
router.delete("/A/delete/:id", authorizeRoles(3), userController.deleteUser);

router.post("/verifyOTP", userController.verifyOTP);

router.get(
  "/UV/validateKey",
  authorizeRoles(1, 2, 3),
  userController.validateToken
);

router.get(
  "/UV/getuserByKey",
  authorizeRoles(1, 2, 3),
  userController.getUserData
);

router.get(
  "/UV/unsignKey",
  authorizeRoles(1, 2, 3),
  userController.unsignToken
);

module.exports = router;
