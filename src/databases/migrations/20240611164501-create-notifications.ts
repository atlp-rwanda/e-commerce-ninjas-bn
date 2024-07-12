/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, QueryInterface} from "sequelize";

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    await queryInterface.createTable("notifications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      message: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("notifications");
  }
};