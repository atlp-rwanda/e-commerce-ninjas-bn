import { QueryInterface, DataTypes } from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("orders", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      products: {
        type: DataTypes.JSONB
        
      },
      shopId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "shops",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "carts",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      paymentMethodId: {
        type: DataTypes.STRING,
        allowNull: false
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
      shippingProcess: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expectedDeliveryDate:{
        type:DataTypes.DATE,
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