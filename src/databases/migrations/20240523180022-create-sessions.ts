import { QueryInterface, DataTypes } from "sequelize";
export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: new DataTypes.INTEGER,
        allowNull: false
      },
      device: {
        type: new DataTypes.STRING(280),
        allowNull: true
      },
      token: {
        type: new DataTypes.STRING(280),
        allowNull: true
      },
      otp: {
        type: new DataTypes.STRING(280),
        allowNull: true
      },
      createdAt: {
        field: "createdAt",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        field: "updatedAt",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("sessions");
  }
};