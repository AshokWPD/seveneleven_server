const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel"); // Adjust if your user model path is different

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id", // Adjust this if your User PK is named differently
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true, // You can make this ENUM if needed
    },
    appRoute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    webRoute: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_At: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: (notification) => {
        notification.created_At = getCurrentLocalDateTime();
        notification.updated_At = getCurrentLocalDateTime();
      },
      beforeUpdate: (notification) => {
        notification.updated_At = getCurrentLocalDateTime();
      },
    },
  }
);

// Utility for IST timestamp
function getCurrentLocalDateTime() {
  const now = new Date();
  const timeZoneOffset = 5.5 * 60; // IST
  return new Date(now.getTime() + timeZoneOffset * 60 * 1000);
}

module.exports = Notification;
