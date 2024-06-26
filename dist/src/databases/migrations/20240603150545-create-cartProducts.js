"use strict";
/* eslint-disable comma-dangle */
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("cartProducts", {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            cartId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "carts",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            discount: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true,
            },
            price: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            totalPrice: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("cartProducts");
    },
};
//# sourceMappingURL=20240603150545-create-cartProducts.js.map