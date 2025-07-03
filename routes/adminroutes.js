const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const authorizeRoles = require("../middleware/roleAuth");
const {
  createAdminSchema,
  editAdminSchema,
} = require("../validators/adminValidators");
const validate = require("../middleware/validate");

router.post(
  "/createAdmin",
  validate(createAdminSchema),
  adminController.createAdmin
);

// Edit Admin by ID
router.put(
  "/editAdmin/:id",
  validate(editAdminSchema),
  authorizeRoles(3),
  adminController.editAdminById
);

// Login Admin
router.post("/login", adminController.loginAdmin);

// Get Admin by ID, Email or Mobile
router.get("/getAdmin", authorizeRoles(3), adminController.getAdmin);

// Get All Admins with Filters
router.get("/getAllAdmins", authorizeRoles(3), adminController.getAllAdmins);

// Search Admins
router.get("/search", authorizeRoles(3), adminController.searchAdmins);

// Delete Admin
router.delete("/delete/:id", authorizeRoles(3), adminController.deleteAdmin);

// forgot password
router.post(
  "/forgotPassword/:identifier",
  authorizeRoles(3),
  adminController.forgotPassword
);

router.post("/verifyOTP", adminController.verifyOTP);

router.put("/updatePassword", adminController.updatePassword);

router.get("/validateKey", authorizeRoles(3), adminController.validateToken);

router.get("/getuserByKey", authorizeRoles(3), adminController.getAdminData);

router.get("/unsignKey", authorizeRoles(3), adminController.unsignToken);

module.exports = router;
