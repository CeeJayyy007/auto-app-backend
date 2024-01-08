'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Appointments', 'time', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '08:00'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Appointments', 'time', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '8:00'
    });
  }
};
