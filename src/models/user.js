const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

// Define the User model
const User = sequelize.define(
  'User',
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/ // Regular expression to validate phone number format
      }
    },
    roles: {
      type: DataTypes.ENUM('User', 'Admin', 'Super Admin'),
      allowNull: false,
      defaultValue: 'User'
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    // Exclude password and deletedAt fields by default when converting to JSON
    defaultScope: {
      attributes: { exclude: ['password', 'deletedAt'] }
    }
  }
);

module.exports = User;
