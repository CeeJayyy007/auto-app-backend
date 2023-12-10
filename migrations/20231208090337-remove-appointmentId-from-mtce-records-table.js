'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('MaintenanceRecords', 'appointmentId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('MaintenanceRecords', 'appointmentId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Appointments',
        key: 'id'
      }
    });
  }
};
