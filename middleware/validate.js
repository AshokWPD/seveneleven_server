const { sendError } = require("../utils/responseHelper");

module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error) {
    return sendError(res, error.details[0].message, 400);
  }
  req.validatedBody = value;
  next();
};
