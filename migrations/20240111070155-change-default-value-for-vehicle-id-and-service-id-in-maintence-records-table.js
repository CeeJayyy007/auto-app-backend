'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('MaintenanceRecords', 'inventoryId', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    });

    await queryInterface.changeColumn('MaintenanceRecords', 'serviceId', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('MaintenanceRecords', 'inventoryId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('MaintenanceRecords', 'serviceId', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
