import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("order_products", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products", // refers to table name
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders", // refers to table name
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      unitPrice: {
        type: DataTypes.FLOAT,
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
    await queryInterface.dropTable("order_products");
  }
};