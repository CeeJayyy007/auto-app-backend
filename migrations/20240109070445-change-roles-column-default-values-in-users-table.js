'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'tempRoles', {
      type: Sequelize.ENUM('User', 'Admin', 'Super Admin'),
      allowNull: false,
      defaultValue: 'User'
    });

    await queryInterface.sequelize.query(`
    UPDATE "Users"
    SET "tempRoles" = 'User'
    WHERE "roles" IS NULL;
    `);

    await queryInterface.removeColumn('Users', 'roles');

    await queryInterface.renameColumn('Users', 'tempRoles', 'roles');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'roles', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'User'
    });
  }
};
