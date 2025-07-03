const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CommercialLink = sequelize.define(
  "CommercialLink",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    youtube: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    whatsapp: {
      type: DataTypes.STRING,
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
    tableName: "commercial_links",
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

module.exports = CommercialLink;
