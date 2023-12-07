'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'time');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'time', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
