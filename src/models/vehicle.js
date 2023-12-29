const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Vehicle = sequelize.define(
  'Vehicle',
  {
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
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

// Define the one-to-many relationship
User.hasMany(Vehicle, { foreignKey: 'userId' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

module.exports = Vehicle;
