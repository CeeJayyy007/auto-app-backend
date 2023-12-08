'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'maintenanceRecordId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'MaintenanceRecords',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'maintenanceRecordId');
  }
};
