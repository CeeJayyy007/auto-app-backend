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
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '08:00'
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In-Progress', 'Canceled', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    serviceId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
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

// Define the many-to-many relationship for Appointment and Service
Appointment.belongsToMany(Service, {
  through: 'AppointmentService',
  foreignKey: 'appointmentId',
  otherKey: 'serviceId'
});

module.exports = Appointment;
