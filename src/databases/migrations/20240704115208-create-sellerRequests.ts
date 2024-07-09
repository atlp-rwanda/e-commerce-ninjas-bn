/* eslint-disable comma-dangle */
import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("sellerRequests", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      requestStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("sellerRequests");
  },
};
