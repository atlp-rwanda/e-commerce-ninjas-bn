/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "passwordUpdatedAt", {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.sequelize.query(`
      UPDATE users SET "passwordUpdatedAt" = "updatedAt"
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "passwordUpdatedAt");
  }
};
