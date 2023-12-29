'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'Vehicles',
      'registration_number',
      'registrationNumber'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'Vehicles',
      'registrationNumber',
      'registration_number'
    );
  }
};
