"use strict";
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("orders", {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            shopId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "shops",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            cartId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "carts",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            paymentMethodId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            orderDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            status: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("orders");
    }
};
//# sourceMappingURL=20240604150804-create-orders.js.map