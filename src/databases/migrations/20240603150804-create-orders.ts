import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("orders", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // refers to table name
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("orders");
  }
};