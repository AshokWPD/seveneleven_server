const Joi = require("joi");

// Schema for creating a new UserDetails entry
const createUserDetailsSchema = Joi.object({
  userId: Joi.number().integer().required(),
  address: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  pincode: Joi.string().optional(),
  isAllowWhatsapp: Joi.boolean().optional(),
  allowNotification: Joi.boolean().optional(),
  searchHistory: Joi.array().items(Joi.string()).optional(),
  lastSeenService: Joi.array().items(Joi.number()).optional(),
  favorites: Joi.array().items(Joi.number()).optional(),
});

// Schema for editing an existing UserDetails entry
const editUserDetailsSchema = Joi.object({
  userId: Joi.number().integer().optional(),
  address: Joi.string().optional(),
  state: Joi.string().optional(),
  city: Joi.string().optional(),
  pincode: Joi.string().optional(),
  isAllowWhatsapp: Joi.boolean().optional(),
  allowNotification: Joi.boolean().optional(),
  searchHistory: Joi.array().items(Joi.string()).optional(),
  lastSeenService: Joi.array().items(Joi.number()).optional(),
  favorites: Joi.array().items(Joi.number()).optional(),
});

module.exports = {
  createUserDetailsSchema,
  editUserDetailsSchema,
};
