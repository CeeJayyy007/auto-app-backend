'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'servicesQuantities', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });

    await queryInterface.addColumn(
      'MaintenanceRecords',
      'inventoryQuantities',
      {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      }
    );

    await queryInterface.addColumn('MaintenanceRecords', 'discount', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });

    // add value to status column enum
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_MaintenanceRecords_status" ADD VALUE \'Ready\''
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'MaintenanceRecords',
      'servicesQuantities'
    );
    await queryInterface.removeColumn(
      'MaintenanceRecords',
      'inventoryQuantities'
    );
    await queryInterface.removeColumn('MaintenanceRecords', 'discount');

    // remove value from status column enum
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_MaintenanceRecords_status" REMOVE VALUE \'Ready\''
    );
  }
};
