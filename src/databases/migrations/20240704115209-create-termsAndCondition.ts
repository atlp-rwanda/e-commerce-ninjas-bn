import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("termsAndConditions", {

      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      content: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pdfUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isUrl: true
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("termsAndConditions");
  }
};
