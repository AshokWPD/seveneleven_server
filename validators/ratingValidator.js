const Joi = require("joi");

// Schema for creating a new Rating
const createRatingSchema = Joi.object({
  serviceId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  rating: Joi.number().min(0).max(5).required(),
  description: Joi.string().allow(null, '').optional(),
  created_At: Joi.date().optional(),
  updated_At: Joi.date().optional(),
});

// Schema for editing an existing Rating
const editRatingSchema = Joi.object({
  serviceId: Joi.number().integer().optional(),
  userId: Joi.number().integer().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  description: Joi.string().allow(null, '').optional(),
  created_At: Joi.date().optional(),
  updated_At: Joi.date().optional(),
});

module.exports = {
  createRatingSchema,
  editRatingSchema,
};
