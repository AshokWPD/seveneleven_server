const Admin = require("./adminModel");
const User = require("./userModel");
const UserDetails = require("./userDetails");
const Banner = require("./bannerModel");
const Notification = require("./userNotificationModel");
const commercialLinks = require("./commercialLinkModel");
const HelpTicket = require("./helpTicketModel");

module.exports = {
  User,
  UserDetails,
  Admin,
  Banner,
  Notification,
  commercialLinks,
  HelpTicket
};
