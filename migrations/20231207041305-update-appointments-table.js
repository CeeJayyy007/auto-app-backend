'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
      values: ['pending', 'approved', 'rejected', 'completed']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'status');
  }
};
