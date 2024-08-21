import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("paymentMethods", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      bankPayment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      mobilePayment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      bankAccount: {
        type: DataTypes.STRING(128),
        allowNull: true 
      },
      bankName: {
        type: DataTypes.STRING(128),
        allowNull: true
      },
      mobileNumber: {
        type: DataTypes.STRING(20),
        allowNull: true 
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
    await queryInterface.dropTable("paymentMethods");
  }
};
