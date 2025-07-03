const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Banner = sequelize.define(
  "Banner",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bannerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    redirectURLWeb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    redirectURLapp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platform: {
      type: DataTypes.JSON, // Store as array like: ["Web", "Vendor App"]
      allowNull: true,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
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
      beforeCreate: (banner) => {
        banner.created_At = getCurrentLocalDateTime();
        banner.updated_At = getCurrentLocalDateTime();
      },
      beforeUpdate: (banner) => {
        banner.updated_At = getCurrentLocalDateTime();
      },
    },
  }
);

function getCurrentLocalDateTime() {
  const now = new Date();
  const timeZoneOffset = 5.5 * 60; // IST
  return new Date(now.getTime() + timeZoneOffset * 60 * 1000);
}

module.exports = Banner;
