const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Service = sequelize.define(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true
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
    // Exclude deletedAt field by default when converting to JSON
    defaultScope: {
      attributes: { exclude: ['deletedAt'] }
    },
    hooks: {
      beforeSave: (service, options) => {
        return new Promise((resolve) => {
          // Calculate the finalPrice before saving
          service.finalPrice = service.initialPrice * service.markUp;
          resolve();
        });
      }
    }
  }
);

// Define the relationship between Service and User
