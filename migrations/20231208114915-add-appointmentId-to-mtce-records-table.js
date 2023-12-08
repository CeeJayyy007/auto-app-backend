'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'appointmentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'id'
      }
    });

    await queryInterface.removeColumn('Appointments', 'maintenanceRecordId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('MaintenanceRecords', 'appointmentId');

    await queryInterface.addColumn('Appointments', 'maintenanceRecordId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'MaintenanceRecords',
        key: 'id'
      }
    });
  }
};
