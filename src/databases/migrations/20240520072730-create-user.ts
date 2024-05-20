"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          id: {
            allowNull: boolean;
            autoIncrement: boolean;
            primaryKey: boolean;
            type: number;
          };
          firstName: { type: string };
          lastName: { type: string };
          email: { type: any };
          createdAt: { allowNull: boolean; type: Date };
          updatedAt: { allowNull: boolean; type: Date };
        }
      ) => any;
    },
    Sequelize: { INTEGER: any; STRING: any; DATE: any }
  ) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(
    queryInterface: { dropTable: (arg0: string) => any },
    Sequelize: any
  ) {
    await queryInterface.dropTable("users");
  },
};
