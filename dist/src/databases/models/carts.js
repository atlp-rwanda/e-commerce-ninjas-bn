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
const cartProducts_1 = __importDefault(require("./cartProducts"));
const users_1 = __importDefault(require("./users"));
class Carts extends sequelize_1.Model {
    static associate() {
        Carts.belongsTo(users_1.default, { foreignKey: "userId", as: "buyer" });
        Carts.hasMany(cartProducts_1.default, { foreignKey: "cartId", as: "cartProducts" });
    }
}
Carts.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
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
    tableName: "carts",
    timestamps: true,
    modelName: "Carts"
});
exports.default = Carts;
//# sourceMappingURL=carts.js.map