const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Service = require('./service');
const Inventory = require('./inventory');
const Appointment = require('./appointment');

const MaintenanceRecord = sequelize.define(
  'MaintenanceRecord',
  {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
      beforeSave: (maintenanceRecord, options) => {
        return new Promise((resolve) => {
          // Calculate the finalPrice before saving
          if (maintenanceRecord.endDate === null) {
            maintenanceRecord.endDate = new Date();
          }

          const startDate = new Date(maintenanceRecord.startDate);
          const endDate = new Date(maintenanceRecord.endDate);

          if (startDate - endDate === 0) {
            maintenanceRecord.duration = 1;
            resolve();
          }

          maintenanceRecord.duration = startDate - endDate;
          resolve();
        });
      }
    }
  }
);

// Define the relationship between MaintenanceRecords and User
User.hasMany(MaintenanceRecord, { foreignKey: 'userId' });
MaintenanceRecord.belongsTo(User, { foreignKey: 'userId' });

// Define the many-to-many relationship between MaintenanceRecords and Service
MaintenanceRecord.belongsToMany(Service, {
  through: 'MaintenanceRecordService',
  foreignKey: 'maintenanceRecordId',
  otherKey: 'serviceId'
});

// Define the many-to-many relationship between MaintenanceRecords and Inventory
MaintenanceRecord.belongsToMany(Inventory, {
  through: 'MaintenanceRecordInventory',
  foreignKey: 'maintenanceRecordId',
  otherKey: 'inventoryId'
});

// Define a one-to-one relationship between MaintenanceRecords and Appointment
MaintenanceRecord.hasOne(Appointment, { foreignKey: 'appointmentId' });
Appointment.belongsTo(MaintenanceRecord, {
  foreignKey: 'appointmentId'
});

// Define the one-to-many relationship between MaintenanceRecords and Vehicle
MaintenanceRecord.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Vehicle.hasMany(MaintenanceRecord, { foreignKey: 'vehicleId' });

module.export = MaintenanceRecord;
