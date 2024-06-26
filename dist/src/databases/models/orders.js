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
const shops_1 = __importDefault(require("./shops"));
const carts_1 = __importDefault(require("./carts"));
class Orders extends sequelize_1.Model {
    static associate() {
        Orders.belongsTo(shops_1.default, { foreignKey: "shopId", as: "shops" });
        Orders.belongsTo(carts_1.default, { foreignKey: "cartId", as: "carts" });
    }
}
Orders.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    shopId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    cartId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    paymentMethodId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: new sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    status: {
        type: new sequelize_1.DataTypes.STRING,
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
    tableName: "orders",
    timestamps: true,
    modelName: "Orders"
});
exports.default = Orders;
//# sourceMappingURL=orders.js.map