'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'serviceId', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true
    });

    await queryInterface.addColumn('MaintenanceRecords', 'inventoryId', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('MaintenanceRecords', 'serviceId');
    await queryInterface.removeColumn('MaintenanceRecords', 'inventoryId');
  }
};
