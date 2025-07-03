const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  userEmail: Joi.string().email().required(),
  type: Joi.number().default(1),
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

const editUserSchema = Joi.object({
  username: Joi.string().optional(),
  userEmail: Joi.string().email().optional(),

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

module.exports = {
  createUserSchema,
  editUserSchema,
};
