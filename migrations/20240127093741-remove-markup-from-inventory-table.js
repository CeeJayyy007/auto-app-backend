'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Inventories', 'markUp');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('Inventories', 'markUp', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 1
    });
  }
};
