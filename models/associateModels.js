// models/associateModels.js
const User = require("./userModel");
const UserDetails = require("./userDetails");
const Notification = require("./userNotificationModel");

function associateModels() {
  // User -> Userdetails (User as Vendor)
  User.hasMany(UserDetails, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  UserDetails.belongsTo(User, {
    foreignKey: "userId",
  });

  User.hasMany(Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
  Notification.belongsTo(User, {
    foreignKey: "userId",
  });
}

module.exports = associateModels;
