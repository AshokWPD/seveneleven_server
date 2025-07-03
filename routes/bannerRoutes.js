const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const authorizeRoles = require("../middleware/roleAuth");
const validate = require("../middleware/validate");

// Placeholder schemas (create these in validators folder)
const {
  createBannerSchema,
  editBannerSchema,
} = require("../validators/bannerValidators");

// Create
router.post(
  "/A/CreateBanner",
  validate(createBannerSchema),
  authorizeRoles(3),
  bannerController.createBanner
);

// Update
router.put(
  "/A/editBanner/:id",
  validate(editBannerSchema),
  authorizeRoles(3),
  bannerController.editBanner
);

// Delete
router.delete(
  "/A/deleteBanner/:id",
  authorizeRoles(3),
  bannerController.deleteBanner
);

// Get by ID
router.get(
  "/UV/getBanner/:id",
  authorizeRoles(1, 2, 3),
  bannerController.getBannerById
);

// Get all with filters
router.get(
  "/UV/getAllBanners",
  authorizeRoles(1, 2, 3),
  bannerController.getAllBanners
);


// Toggle status (Admin only)
router.patch(
  "/A/toggleBannerStatus/:id",
  authorizeRoles(3),
  bannerController.toggleBannerStatus
);

// Get active banners by platform (Public/All roles)
router.get(
  "/UV/getActiveBanners",
  authorizeRoles(1, 2, 3),
  bannerController.getActiveBannersByPlatform
);


module.exports = router;
