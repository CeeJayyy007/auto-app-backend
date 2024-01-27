const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Inventory = sequelize.define(
  'Inventory',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lowLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    initialPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Low Stock', 'In Stock', 'Out of Stock'),
      allowNull: false,
      defaultValue: 'In Stock'
    },
    finalPrice: {
      type: DataTypes.DECIMAL(12, 2),
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
User.hasMany(Inventory, { foreignKey: 'userId' });
Inventory.belongsTo(User, { foreignKey: 'userId' });

module.exports = Inventory;
