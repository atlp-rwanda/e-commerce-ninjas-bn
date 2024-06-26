"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const carts_1 = __importDefault(require("./carts"));
const products_1 = __importDefault(require("./products"));
class CartProducts extends sequelize_1.Model {
    static associate() {
        CartProducts.belongsTo(carts_1.default, { foreignKey: "cartId", as: "carts" });
        CartProducts.belongsTo(products_1.default, { foreignKey: "productId", as: "products" });
    }
}
CartProducts.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    productId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    cartId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    discount: {
        type: new sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    price: {
        type: new sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: new sequelize_1.DataTypes.FLOAT,
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
    }
}, {
    sequelize: db_config_1.default,
    tableName: "cartProducts",
    timestamps: true,
    modelName: "CartProducts"
});
exports.default = CartProducts;
//# sourceMappingURL=cartProducts.js.map