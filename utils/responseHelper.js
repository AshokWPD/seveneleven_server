// utils/responseHelper.js
function sendResponse(
  res,
  message,
  success = true,
  data = null,
  statusCode = 200
) {
  return res.status(statusCode).json({ message, success, data });
}

function sendError(
  res,
  message = "Something went wrong",
  statusCode = 500,
  data = null
) {
  return res.status(statusCode).json({ message, success: false, data });
}

module.exports = { sendResponse, sendError };
