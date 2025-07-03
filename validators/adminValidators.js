const Joi = require("joi");

// Schema for creating a new Admin
const createAdminSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  userEmail: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  type: Joi.number().default(3),
  isAllowed: Joi.boolean().default(true),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message("Phone number must be 10-15 digits")
    .optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  profileImg: Joi.string().optional(),
  history: Joi.string().optional(),
  location: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  otp: Joi.string().optional(),
  otpExpiresAt: Joi.date().optional(),
});

// Schema for editing an existing Admin
const editAdminSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  userEmail: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  isAllowed: Joi.boolean().optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message("Phone number must be 10-15 digits")
    .optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  age: Joi.number().integer().min(0).max(120).optional(),
  profileImg: Joi.string().optional(),
  history: Joi.string().optional(),
  location: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  otp: Joi.string().optional(),
  otpExpiresAt: Joi.date().optional(),
});

// Export the schemas
module.exports = {
  createAdminSchema,
  editAdminSchema,
};
