import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
  
    const [results] = await queryInterface.sequelize.query(
      "SELECT 1 FROM pg_type WHERE typname = 'enum_users_gender';"
    );
    if (!results.length) {
      await queryInterface.sequelize.query(
        "CREATE TYPE \"enum_users_gender\" AS ENUM('male', 'female');"
      );
    }

    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      lastName: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      phone: {
        type: new DataTypes.BIGINT,
        allowNull: false
      },
      profilePicture: {
        type: new DataTypes.STRING,
        allowNull: false
      },
      gender: {
        type: new DataTypes.ENUM("male", "female"),
        allowNull: false
      },
      birthDate: {
        type: new DataTypes.DATE,
        allowNull: false
      },
      language: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      currency: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      role: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      isVerified: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is2FAEnabled: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      resetPasswordToken: {
        type: new DataTypes.STRING,
        allowNull: true
      },
      resetPasswordExpires: {
        type: new DataTypes.DATE,
        allowNull: true
      },
      lastPasswordChange: { 
        type: new DataTypes.DATE,
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
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_users_gender";
    `);
  }
};
