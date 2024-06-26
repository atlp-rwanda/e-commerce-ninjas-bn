"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
class wishLists extends sequelize_1.Model {
    static associate() {
        wishLists.belongsTo(users_1.default, { foreignKey: "userId", as: "Users" });
        wishLists.belongsTo(products_1.default, { foreignKey: "productId", as: "products" });
    }
}
wishLists.init({
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
    productId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize: db_config_1.default,
    tableName: "wishLists",
    timestamps: true,
    modelName: "WishLists"
});
exports.default = wishLists;
//# sourceMappingURL=wishLists.js.map