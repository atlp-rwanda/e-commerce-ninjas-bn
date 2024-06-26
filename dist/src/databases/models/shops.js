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
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
class Shops extends sequelize_1.Model {
    static associate() {
        Shops.belongsTo(users_1.default, { foreignKey: "userId", as: "users" });
        Shops.hasMany(products_1.default, { foreignKey: "shopId", as: "products" });
    }
}
Shops.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
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
    name: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db_config_1.default,
    tableName: "shops",
    modelName: "Shops"
});
exports.default = Shops;
//# sourceMappingURL=shops.js.map