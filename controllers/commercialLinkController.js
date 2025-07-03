const CommercialLink = require("../models/commercialLinkModel");
const { sendResponse, sendError } = require("../utils/responseHelper");

// Create
exports.createCommercialLink = async (req, res) => {
  try {
    const newLink = await CommercialLink.create(req.validatedBody);
    sendResponse(res, "Commercial links created successfully", true, newLink);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to create commercial links");
  }
};

// Update
exports.editCommercialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await CommercialLink.findByPk(id);
    if (!existing) return sendError(res, "Commercial link not found", 404);

    await existing.update(req.validatedBody);
    sendResponse(res, "Commercial links updated successfully", true, existing);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to update commercial links");
  }
};

// Delete
exports.deleteCommercialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CommercialLink.destroy({ where: { id } });
    if (!deleted) return sendError(res, "Commercial link not found", 404);

    sendResponse(res, "Commercial links deleted successfully", true);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to delete commercial links");
  }
};

// Get All
exports.getAllCommercialLinks = async (req, res) => {
  try {
    const data = await CommercialLink.findAll({ order: [["id", "DESC"]] });
    sendResponse(res, "All commercial links fetched successfully", true, data);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch commercial links");
  }
};

// Get by ID
exports.getCommercialLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CommercialLink.findByPk(id);
    if (!data) return sendError(res, "Commercial link not found", 404);

    sendResponse(res, "Commercial link fetched successfully", true, data);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch commercial link");
  }
};
