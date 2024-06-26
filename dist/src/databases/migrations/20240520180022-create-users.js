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
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            firstName: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            lastName: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            email: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false
            },
            password: {
                type: new sequelize_1.DataTypes.STRING(255),
                allowNull: false
            },
            phone: {
                type: new sequelize_1.DataTypes.BIGINT(),
                allowNull: true
            },
            profilePicture: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            gender: {
                type: new sequelize_1.DataTypes.ENUM("male", "female"),
                allowNull: true
            },
            birthDate: {
                type: new sequelize_1.DataTypes.DATE(),
                allowNull: true
            },
            language: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            currency: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            role: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: true
            },
            isVerified: {
                type: new sequelize_1.DataTypes.BOOLEAN(),
                allowNull: false,
                defaultValue: false
            },
            isGoogleAccount: {
                type: new sequelize_1.DataTypes.BOOLEAN(),
                allowNull: true,
                defaultValue: false
            },
            is2FAEnabled: {
                type: new sequelize_1.DataTypes.BOOLEAN(),
                allowNull: false,
                defaultValue: false
            },
            status: {
                type: new sequelize_1.DataTypes.STRING(128),
                allowNull: false,
                defaultValue: "enabled"
            },
            passwordUpdatedAt: {
                field: "passwordUpdatedAt",
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
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
        await queryInterface.dropTable("users");
        await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_users_gender\";");
    }
};
//# sourceMappingURL=20240520180022-create-users.js.map