const Joi = require("joi");

const createCommercialLinkSchema = Joi.object({
  facebook: Joi.string().uri().optional().allow(null, ""),
  twitter: Joi.string().uri().optional().allow(null, ""),
  instagram: Joi.string().uri().optional().allow(null, ""),
  linkedin: Joi.string().uri().optional().allow(null, ""),
  youtube: Joi.string().uri().optional().allow(null, ""),
  website: Joi.string().uri().optional().allow(null, ""),
  whatsapp: Joi.string().optional().allow(null, ""),
  created_At: Joi.date().optional(),
  updated_At: Joi.date().optional(),
});

const editCommercialLinkSchema = Joi.object({
  facebook: Joi.string().uri().optional().allow(null, ""),
  twitter: Joi.string().uri().optional().allow(null, ""),
  instagram: Joi.string().uri().optional().allow(null, ""),
  linkedin: Joi.string().uri().optional().allow(null, ""),
  youtube: Joi.string().uri().optional().allow(null, ""),
  website: Joi.string().uri().optional().allow(null, ""),
  whatsapp: Joi.string().optional().allow(null, ""),
  updated_At: Joi.date().optional(),
});

module.exports = {
  createCommercialLinkSchema,
  editCommercialLinkSchema,
};
