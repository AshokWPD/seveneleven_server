const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const UserDetails = sequelize.define('UserDetails', {
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
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isAllowWhatsapp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  allowNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  searchHistory: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  lastSeenService: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  favorites: {
    type: DataTypes.JSON,
    defaultValue: [],
  }
}, {
  timestamps: true,
});

module.exports = UserDetails;
