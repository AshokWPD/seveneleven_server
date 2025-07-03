const Joi = require("joi");

const createNotificationSchema = Joi.object({
  userId: Joi.number().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  imageUrl: Joi.string().allow(null, ""),
  type: Joi.string().allow(null, ""),
  appRoute: Joi.string().allow(null, ""),
  webRoute: Joi.string().allow(null, ""),
  isRead: Joi.boolean().default(false),
});

const editNotificationSchema = Joi.object({
  title: Joi.string(),
  body: Joi.string(),
  imageUrl: Joi.string().allow(null, ""),
  type: Joi.string().allow(null, ""),
  appRoute: Joi.string().allow(null, ""),
  webRoute: Joi.string().allow(null, ""),
  isRead: Joi.boolean(),
});

module.exports = {
  createNotificationSchema,
  editNotificationSchema,
};
