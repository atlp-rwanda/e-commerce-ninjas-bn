import { QueryInterface, DataTypes } from "sequelize";
export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      lastName: {
        type: new DataTypes.STRING(128),
        allowNull:false,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      password:{
        type:new DataTypes.STRING(128),
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users");
  },
};
