// models/user.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isAllowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    history: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
      beforeCreate: (Admin) => {
        Admin.created_At = getCurrentLocalDateTime();
        Admin.updated_At = getCurrentLocalDateTime();
      },
      beforeUpdate: (Admin) => {
        Admin.updated_At = getCurrentLocalDateTime();
      },
      afterCreate: (Admin) => {
        if (global.io) {
          console.log("Admin created event emitted.");
          global.io.emit("serverreload", Admin);
        }
      },
      afterUpdate: (Admin) => {
        if (global.io) {
          console.log("Admin updated event emitted.");
          global.io.emit("serverreload", Admin);
        }
      },
      afterDestroy: (Admin) => {
        if (global.io) {
          console.log("Admin deleted event emitted.");
          global.io.emit("serverreload", Admin);
        }
      },
    },
  }
);

function getCurrentLocalDateTime() {
  const now = new Date();

  // Get the offset for the Asia/Kolkata timezone
  const timeZoneOffset = 5.5 * 60; // IST (Indian Standard Time) is UTC+5:30
  const localTime = new Date(now.getTime() + timeZoneOffset * 60 * 1000);

  return localTime;
}

module.exports = Admin;
