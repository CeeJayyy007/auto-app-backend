'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'serviceRequest', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'serviceRequest', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    });
  }
};
