"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface) => {
        await queryInterface.createTable("tokens", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: new sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            device: {
                type: new sequelize_1.DataTypes.STRING(280),
                allowNull: false
            },
            accessToken: {
                type: new sequelize_1.DataTypes.STRING(280),
                allowNull: false
            },
            createdAt: {
                field: "createdAt",
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updatedAt: {
                field: "updatedAt",
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            expiresAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("tokens");
    }
};
//# sourceMappingURL=20240523180022-create-tokens.js.map