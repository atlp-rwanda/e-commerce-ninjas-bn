/* eslint-disable no-shadow */
import { DataTypes, Sequelize,QueryInterface  } from "sequelize";

export default {
  up:async(queryInterface: QueryInterface, Sequelize: Sequelize)=> {
    await queryInterface.createTable("collection", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(128)
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
      description: {
        type: DataTypes.STRING,
        allowNull: true
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

  down: async (queryInterface: QueryInterface)=>{
    await queryInterface.dropTable("collection");
  }
};