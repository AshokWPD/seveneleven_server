const Joi = require("joi");

const createHelpTicketSchema = Joi.object({
  userId: Joi.number().integer().required(),
  subject: Joi.string().min(3).required(),
  message: Joi.string().min(5).required(),
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .optional(),
  response: Joi.string().optional().allow(null, ""),
  created_At: Joi.date().optional(),
  updated_At: Joi.date().optional(),
});

const editHelpTicketSchema = Joi.object({
  subject: Joi.string().min(3).optional(),
  message: Joi.string().min(5).optional(),
  status: Joi.string()
    .valid("open", "in_progress", "resolved", "closed")
    .optional(),
  response: Joi.string().optional().allow(null, ""),
  updated_At: Joi.date().optional(),
});

module.exports = {
  createHelpTicketSchema,
  editHelpTicketSchema,
};
