const express = require("express");
const router = express.Router();
const commercialController = require("../controllers/commercialLinkController");
const validate = require("../middleware/validate");
const authorizeRoles = require("../middleware/roleAuth");
const {
  createCommercialLinkSchema,
  editCommercialLinkSchema,
} = require("../validators/commercialLinkValidator");

// POST - Create
router.post(
  "/A/createCommercialLink",
  validate(createCommercialLinkSchema),
  authorizeRoles(3),
  commercialController.createCommercialLink
);

// PUT - Edit
router.put(
  "/A/editCommercialLink/:id",
  validate(editCommercialLinkSchema),
  authorizeRoles(3),
  commercialController.editCommercialLink
);

// DELETE - Delete
router.delete(
  "/A/deleteCommercialLink/:id",
  authorizeRoles(3),
  commercialController.deleteCommercialLink
);

// GET - All
router.get(
  "/UV/getAllCommercialLinks",
  authorizeRoles(1, 2, 3),
  commercialController.getAllCommercialLinks
);

// GET - By ID
router.get(
  "/UV/getCommercialLink/:id",
  authorizeRoles(1, 2, 3),
  commercialController.getCommercialLinkById
);

module.exports = router;
