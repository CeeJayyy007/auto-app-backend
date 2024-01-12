'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'status', {
      type: Sequelize.ENUM('In-Progress', 'Canceled', 'Completed'),
      allowNull: false,
      defaultValue: 'In-Progress'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('MaintenanceRecords', 'status');
  }
};
