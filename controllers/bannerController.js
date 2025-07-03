const Banner = require("../models/bannerModel");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { Op } = require("sequelize");

// Create Banner
exports.createBanner = async (req, res) => {
  try {
    const newBanner = await Banner.create(req.validatedBody);
    sendResponse(res, "Banner created successfully", true, newBanner, 201);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to create banner");
  }
};

// Edit Banner
exports.editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return sendError(res, "Banner not found", 404);

    const updatedBanner = await banner.update(req.validatedBody);
    sendResponse(res, "Banner updated successfully", true, updatedBanner);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to update banner");
  }
};

// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return sendError(res, "Banner not found", 404);

    await banner.destroy();
    sendResponse(res, "Banner deleted successfully");
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to delete banner");
  }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return sendError(res, "Banner not found", 404);

    sendResponse(res, "Banner fetched successfully", true, banner);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch banner");
  }
};

// Get All Banners with Filters
exports.getAllBanners = async (req, res) => {
  try {
    const {
      search,
      type,
      categoryName,
      subCategoryName,
      isActive,
      platform,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    // Search by title, description, categoryName, subCategoryName
    if (search) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { categoryName: { [Op.like]: `%${search}%` } },
        { subCategoryName: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by banner type
    if (type) {
      filters.bannerType = { [Op.eq]: type };
    }

    if (categoryName) {
      filters.categoryName = { [Op.eq]: categoryName };
    }

    if (subCategoryName) {
      filters.subCategoryName = { [Op.eq]: subCategoryName };
    }

    // Filter by isActive status
    if (typeof isActive !== "undefined") {
      filters.isActive = isActive === "true";
    }

    // Filter by platform (array contains platform)
    if (platform) {
      const platformArray = platform.split(",").map((p) => p.trim());
      filters[Op.or] = platformArray.map((p) => ({
        platform: { [Op.contains]: [p] },
      }));
    }

    // Filter by date range (startDate to endDate)
    if (startDate || endDate) {
      filters.startDate = {};
      if (startDate) {
        filters.startDate[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        filters.startDate[Op.lte] = new Date(endDate);
      }
    }

    const banners = await Banner.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["id", "DESC"]],
    });

    sendResponse(res, "Banners fetched successfully", true, {
      total: banners.count,
      pages: Math.ceil(banners.count / limit),
      data: banners.rows,
    });
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch banners");
  }
};



// Toggle Banner Active Status
exports.toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) return sendError(res, "Banner not found", 404);

    banner.isActive = !banner.isActive;
    await banner.save();

    sendResponse(res, `Banner status updated to ${banner.isActive}`, true, banner);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to toggle banner status");
  }
};



// Get Active Banners by Platform
exports.getActiveBannersByPlatform = async (req, res) => {
  try {
    const { platform } = req.query;
    if (!platform) return sendError(res, "Platform is required", 400);

    const banners = await Banner.findAll({
      where: {
        isActive: true,
        platform: { [Op.contains]: [platform] },
      },
      order: [["startDate", "ASC"]],
    });

    const plainBanners = banners.map(b => b.toJSON());
    sendResponse(res, "Active banners fetched successfully", true, plainBanners);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch active banners");
  }
};
