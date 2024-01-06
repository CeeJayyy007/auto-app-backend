'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'tempStatus', {
      type: Sequelize.ENUM('Pending', 'In-Progress', 'Canceled', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending'
    });

    await queryInterface.sequelize.query(`
    UPDATE "Appointments"
    SET "tempStatus" = 'Pending'
    WHERE "status" IS NULL;
    `);

    await queryInterface.removeColumn('Appointments', 'status');

    await queryInterface.renameColumn('Appointments', 'tempStatus', 'status');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Appointments', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Pending'
    });
  }
};
