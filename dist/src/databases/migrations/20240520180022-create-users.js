"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface) => {
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
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("users");
    }
};
//# sourceMappingURL=20240520180022-create-users.js.map