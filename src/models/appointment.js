const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Appointment = sequelize.define(
  'Appointment',
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
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

// Define the one-to-many relationship
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Appointment;
