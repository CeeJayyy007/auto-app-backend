'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropColumn('Services', 'serviceRequest', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Services', 'serviceRequest', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    });
  }
};
