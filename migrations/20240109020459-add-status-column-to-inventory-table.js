'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Inventories', 'status', {
      type: Sequelize.ENUM('Low Stock', 'In Stock', 'Out of Stock'),
      allowNull: false,
      defaultValue: 'In Stock'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Inventories', 'status');
  }
};
