"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("shops", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4
            },
            name: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING(128)
            },
            userId: {
                allowNull: false,
                type: sequelize_1.DataTypes.UUID,
                references: {
                    model: "users",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("shops");
    }
};
//# sourceMappingURL=20240601223523-create-shops.js.map