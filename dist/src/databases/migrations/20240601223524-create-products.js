"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("products", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            shopId: {
                allowNull: false,
                type: sequelize_1.DataTypes.UUID,
                references: {
                    model: "shops",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            name: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            price: {
                allowNull: false,
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            discount: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            category: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            expiryDate: {
                type: sequelize_1.DataTypes.DATE,
            },
            expired: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            bonus: {
                type: sequelize_1.DataTypes.STRING,
            },
            images: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            },
            quantity: {
                allowNull: false,
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.STRING(128),
                allowNull: false,
                defaultValue: "available",
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("products");
    },
};
//# sourceMappingURL=20240601223524-create-products.js.map