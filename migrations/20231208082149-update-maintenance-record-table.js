'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'vehicleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Vehicles',
        key: 'id'
      }
    });

    await queryInterface.addColumn('MaintenanceRecords', 'appointmentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('MaintenanceRecords', 'vehicleId');
    await queryInterface.removeColumn('MaintenanceRecords', 'appointmentId');
  }
};
