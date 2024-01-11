'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'MaintenanceRecords',
      'description',
      'note'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'MaintenanceRecords',
      'note',
      'description'
    );
  }
};
