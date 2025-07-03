const express = require("express");
const router = express.Router();
const userDetailsController = require("../controllers/userdetailsController");
const authorizeRoles = require("../middleware/roleAuth");
const validate = require("../middleware/validate");
const {
  createUserDetailsSchema,
  editUserDetailsSchema,
} = require("../validators/userDetailsValidator");

router.post(
  "/UA/createUserDetail",
  validate(createUserDetailsSchema),
  authorizeRoles(3),
  userDetailsController.createUserDetails
);
router.put(
  "/UA/updateUserDetail/:id",
  validate(editUserDetailsSchema),
  authorizeRoles(1, 3),
  userDetailsController.updateUserDetails
);
router.get(
  "/UV/getUserDetail/:id",
  authorizeRoles(1, 2, 3),
  userDetailsController.getUserDetailsById
);
router.get(
  "/UV/getallUserDetail",
  authorizeRoles(1, 2, 3),
  userDetailsController.getAllUserDetails
);
router.get(
  "/UV/getUserDetail-by-user/:userId",
  authorizeRoles(1, 2, 3),
  userDetailsController.getUserDetailsByUserId
);

module.exports = router;
