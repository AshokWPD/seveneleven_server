const express = require("express");
const router = express.Router();
const helpTicketController = require("../controllers/helpTicketController");
const validate = require("../middleware/validate");
const authorizeRoles = require("../middleware/roleAuth");
const {
  createHelpTicketSchema,
  editHelpTicketSchema,
  respondToTicketSchema
} = require("../validators/helpTicketValidator");

// Create
router.post(
  "/UV/createHelpTicket",
  validate(createHelpTicketSchema),
  authorizeRoles(1, 2, 3),
  helpTicketController.createHelpTicket
);

// Edit
router.put(
  "/A/editHelpTicket/:id",
  validate(editHelpTicketSchema),
  authorizeRoles(3),
  helpTicketController.editHelpTicket
);

// Delete
router.delete(
  "/A/deleteHelpTicket/:id",
  authorizeRoles(3),
  helpTicketController.deleteHelpTicket
);

// Get all
router.get(
  "/UV/getAllHelpTickets",
  authorizeRoles(1, 2, 3),
  helpTicketController.getAllHelpTickets
);

// Get by ID
router.get(
  "/UV/getHelpTicket/:id",
  authorizeRoles(1, 2, 3),
  helpTicketController.getHelpTicketById
);

// Route
router.get(
  "/UV/getTicketsByUser/:userId",
  authorizeRoles(1, 2, 3),
  helpTicketController.getHelpTicketsByUserId
);


// Route
router.get(
  "/UV/getTicketsByStatus",
  authorizeRoles(2, 3),
  helpTicketController.getTicketsByStatus
);


// Route
router.put(
  "/A/respondToTicket/:id",
  authorizeRoles(3),
  helpTicketController.respondToTicket
);


// Route
router.put(
  "/A/bulkCloseResolvedTickets",
  authorizeRoles(3),
  helpTicketController.bulkCloseResolvedTickets
);


// Route
router.get(
  "/UV/searchTickets",
  authorizeRoles(2, 3),
  helpTicketController.searchTickets
);


// Route
router.get(
  "/A/countTicketsByStatus",
  authorizeRoles(3),
  helpTicketController.countTicketsByStatus
);


// Route
router.get(
  "/A/exportTicketsCSV",
  authorizeRoles(3),
  helpTicketController.exportTicketsCSV
);


module.exports = router;
