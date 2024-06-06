/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryInterface, DataTypes } from "sequelize";

export default{
  up :async (queryInterface: QueryInterface, Sequelize: any)=> {
  await queryInterface.createTable("Products", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
          allowNull: false,
          type: DataTypes.STRING
      },
      description: {
          type: DataTypes.STRING,
          allowNull: true
      },
      price: {
          allowNull: false,
          type: DataTypes.DECIMAL(10, 2)
      },
      discount: {
          type: DataTypes.STRING,
          allowNull: true
      },
      category: {
          allowNull: false,
          type: DataTypes.STRING
      },
      expiryDate: {
          type: DataTypes.DATE
      },
      expired: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      bonus: {
          type: DataTypes.STRING
      },
      collectionId: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
              model: "collection",
              key: "id"
          },
          onDelete: "CASCADE"
      },
      shopId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
            model: "shops",
            key: "id"
        },
        onDelete: "CASCADE"
    },
      images: {
          type: DataTypes.ARRAY(DataTypes.STRING)
      },
      quantity: {
          allowNull: false,
          type: DataTypes.INTEGER,
          defaultValue: 0
      },
      isAvailable: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: "available"
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
    await queryInterface.dropTable("Products");
  }
}
