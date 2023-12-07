const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Service = sequelize.define(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    }
  }
);

// Define the relationship between Service and User
User.hasMany(Service, { foreignKey: 'userId' });
Service.belongsTo(User, { foreignKey: 'userId' });

module.exports = Service;
