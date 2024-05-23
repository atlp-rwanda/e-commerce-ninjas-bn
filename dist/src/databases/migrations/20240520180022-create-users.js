"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface) => {
        const [results] = await queryInterface.sequelize.query("SELECT 1 FROM pg_type WHERE typname = 'enum_users_gender';");
        if (!results.length) {
            await queryInterface.sequelize.query("CREATE TYPE \"enum_users_gender\" AS ENUM('male', 'female');");
        }
        await queryInterface.createTable("users", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            firstName: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            lastName: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            email: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            password: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            phone: {
                type: new sequelize_1.DataTypes.BIGINT,
                allowNull: false
            },
            profilePicture: {
                type: new sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            gender: {
                type: new sequelize_1.DataTypes.ENUM("male", "female"),
                allowNull: false
            },
            birthDate: {
                type: new sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            language: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            currency: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            role: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            isVerified: {
                type: new sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            is2FAEnabled: {
                type: new sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            status: {
                type: new sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
    },
    down: async (queryInterface) => {
        // Drop the users table
        await queryInterface.dropTable("users");
        // Drop the enum type if it exists
        await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_users_gender";
    `);
    }
};
//# sourceMappingURL=20240520180022-create-users.js.map