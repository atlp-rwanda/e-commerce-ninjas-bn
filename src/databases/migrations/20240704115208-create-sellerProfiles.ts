/* eslint-disable comma-dangle */
import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("sellerProfiles", {
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
      shopsId: {
        allowNull: false,
              type: DataTypes.UUID,

              references: {
                  model: "shops",
                  key: "id"
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
      },
      paymentMethodId:{
        type: DataTypes.UUID,
        allowNull: false,
        references:{
          model: "paymentMethods",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      businessName: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      tin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rdbDocument:{
        type:  DataTypes.STRING(255),
        allowNull: true,
      },
      terms:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("sellerProfiles");
  },
};
