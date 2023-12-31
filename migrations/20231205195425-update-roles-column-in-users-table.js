'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'roles', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
      values: ['admin', 'superAdmin', 'user']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'roles');
  }
};
