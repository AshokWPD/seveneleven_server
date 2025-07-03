const HelpTicket = require("../models/helpTicketModel");
const User = require("../models/userModel");
const { sendResponse, sendError } = require("../utils/responseHelper");

// Create
exports.createHelpTicket = async (req, res) => {
  try {
    const ticket = await HelpTicket.create(req.validatedBody);
    sendResponse(res, "Help ticket created successfully", true, ticket);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to create help ticket");
  }
};

// Update
exports.editHelpTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await HelpTicket.findByPk(id);
    if (!ticket) return sendError(res, "Ticket not found", 404);

    await ticket.update(req.validatedBody);
    sendResponse(res, "Help ticket updated", true, ticket);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to update help ticket");
  }
};

// Delete
exports.deleteHelpTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HelpTicket.destroy({ where: { id } });
    if (!deleted) return sendError(res, "Ticket not found", 404);

    sendResponse(res, "Ticket deleted", true);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to delete ticket");
  }
};

// Get All
exports.getAllHelpTickets = async (req, res) => {
  try {
    const data = await HelpTicket.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["id", "DESC"]],
    });
    sendResponse(res, "Tickets fetched", true, data);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch tickets");
  }
};

// Get by ID
exports.getHelpTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await HelpTicket.findByPk(id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!ticket) return sendError(res, "Ticket not found", 404);
    sendResponse(res, "Ticket fetched", true, ticket);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch ticket");
  }
};


// Controller
exports.getHelpTicketsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await HelpTicket.findAll({
      where: { userId },
      order: [["id", "DESC"]],
    });
    sendResponse(res, "User tickets fetched successfully", true, tickets);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch user tickets");
  }
};


// Controller
exports.getTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const tickets = await HelpTicket.findAll({
      where: { status },
      order: [["id", "DESC"]],
    });
    sendResponse(res, "Tickets by status fetched", true, tickets);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to fetch tickets by status");
  }
};


// Controller
exports.respondToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, status } = req.body;

    const ticket = await HelpTicket.findByPk(id);
    if (!ticket) return sendError(res, "Ticket not found", 404);

    await ticket.update({
      response: response || ticket.response,
      status: status || ticket.status,
    });

    sendResponse(res, "Response updated", true, ticket);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to respond to ticket");
  }
};



// Controller
exports.bulkCloseResolvedTickets = async (req, res) => {
  try {
    const updated = await HelpTicket.update(
      { status: "closed" },
      { where: { status: "resolved" } }
    );

    sendResponse(res, `${updated[0]} tickets closed`, true);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to close resolved tickets");
  }
};


// Controller
exports.searchTickets = async (req, res) => {
  try {
    const { query } = req.query;
    const tickets = await HelpTicket.findAll({
      where: {
        [Op.or]: [
          { subject: { [Op.like]: `%${query}%` } },
          { message: { [Op.like]: `%${query}%` } },
        ],
      },
    });
    sendResponse(res, "Search results", true, tickets);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to search tickets");
  }
};


// Controller
exports.countTicketsByStatus = async (req, res) => {
  try {
    const statuses = ["open", "in_progress", "resolved", "closed"];
    const counts = {};

    for (const status of statuses) {
      counts[status] = await HelpTicket.count({ where: { status } });
    }

    sendResponse(res, "Ticket status counts", true, counts);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to count tickets");
  }
};


// Controller
exports.exportTicketsCSV = async (req, res) => {
  try {
    const tickets = await HelpTicket.findAll();
    const csvData = tickets.map(ticket => ({
      ID: ticket.id,
      UserID: ticket.userId,
      Subject: ticket.subject,
      Message: ticket.message,
      Status: ticket.status,
      Response: ticket.response,
    }));

    const fields = ["ID", "UserID", "Subject", "Message", "Status", "Response"];
    const { Parser } = require("json2csv");
    const parser = new Parser({ fields });

    const csv = parser.parse(csvData);
    res.header("Content-Type", "text/csv");
    res.attachment("help_tickets.csv");
    return res.send(csv);
  } catch (error) {
    console.error(error);
    sendError(res, "Failed to export tickets");
  }
};


