const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const HelpTicket = sequelize.define(
  "HelpTicket",
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
        key: "id",
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "resolved", "closed"),
      defaultValue: "open",
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_At: {
      type: DataTypes.DATE,
    },
    updated_At: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: "help_tickets",
    hooks: {
      beforeCreate: (record) => {
        const now = new Date();
        record.created_At = now;
        record.updated_At = now;
      },
      beforeUpdate: (record) => {
        record.updated_At = new Date();
      },
    },
  }
);

module.exports = HelpTicket;
