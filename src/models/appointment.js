const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Vehicle = require('./vehicle');
const Service = require('./service');

const Appointment = sequelize.define(
  'Appointment',
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    serviceRequest: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      values: ['pending', 'approved', 'rejected', 'completed']
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

// Define the one-to-many relationship for User and Appointment
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

// Define the one-to-many relationship for Vehicle and Appointment
Vehicle.hasMany(Appointment, { foreignKey: 'vehicleId' });
Appointment.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Define the one-to-many relationship for Appointment and Service
Appointment.hasMany(Service, { foreignKey: 'appointmentId' });
Service.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = Appointment;
