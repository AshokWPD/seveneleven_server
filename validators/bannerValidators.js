const Joi = require("joi");

// Schema for creating a new Banner
const createBannerSchema = Joi.object({
  bannerType: Joi.string().min(2).max(100).required(),
  categoryName: Joi.string().min(2).max(100).optional(),
  subCategoryName: Joi.string().min(2).max(100).optional(),
  bannerImage: Joi.string().optional(),
  redirectURLWeb: Joi.string().optional(),
  redirectURLapp: Joi.string().optional(),
  platform: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

// Schema for editing an existing Banner
const editBannerSchema = Joi.object({
  bannerType: Joi.string().min(2).max(100).optional(),
  categoryName: Joi.string().min(2).max(100).optional(),
  subCategoryName: Joi.string().min(2).max(100).optional(),
  bannerImage: Joi.string().optional(),
  redirectURLWeb: Joi.string().optional(),
  redirectURLapp: Joi.string().optional(),
  platform: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  title: Joi.string().min(2).max(200).optional(),
  description: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

// Export the schemas
module.exports = {
  createBannerSchema,
  editBannerSchema,
};
