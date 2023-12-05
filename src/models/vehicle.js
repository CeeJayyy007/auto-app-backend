const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Vehicle = sequelize.define('Vehicle', {
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
  registration_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Define the one-to-many relationship
User.hasMany(Vehicle, { foreignKey: 'userId' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

module.exports = Vehicle;
