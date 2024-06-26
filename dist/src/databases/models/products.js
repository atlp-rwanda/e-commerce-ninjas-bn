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
const cartProducts_1 = __importDefault(require("./cartProducts"));
class Products extends sequelize_1.Model {
    static associate() {
        Products.belongsTo(shops_1.default, { foreignKey: "shopId", as: "shops" });
        Products.hasMany(cartProducts_1.default, { foreignKey: "productId", as: "cartProducts" });
    }
}
Products.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    shopId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "Shops",
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
        allowNull: false,
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
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
}, {
    sequelize: db_config_1.default,
    tableName: "products",
    modelName: "Products",
    timestamps: true,
});
exports.default = Products;
//# sourceMappingURL=products.js.map