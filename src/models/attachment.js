const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const MaintenanceRecord = require('./maintenanceRecord');

const Attachment = sequelize.define(
  'Attachment',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    filePath: {
      type: DataTypes.TEXT,
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

// define relationship between Attachement and User
User.hasMany(Attachment, { foreignKey: 'userId' });
Attachment.belongsTo(User, { foreignKey: 'userId' });

// define relationship between Attachement and MaintenanceRecord
MaintenanceRecord.hasMany(Attachment, { foreignKey: 'maintenanceRecordId' });
Attachment.belongsTo(MaintenanceRecord, { foreignKey: 'maintenanceRecordId' });

module.exports = Attachment;
