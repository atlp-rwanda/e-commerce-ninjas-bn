/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Carts from "./carts";
import Products from "./products";


export interface CartProductAttributes {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    discount: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

class CartProducts extends Model<CartProductAttributes> implements CartProductAttributes {
    declare id: string;
    declare productId: string;
    declare cartId: string;
    declare quantity: number;
    declare discount: number;
    declare price: number;
    declare totalPrice: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        CartProducts.belongsTo(Carts, { foreignKey: "cartId", as: "carts" });
        CartProducts.belongsTo(Products, { foreignKey: "productId", as: "products" });
    }
}

CartProducts.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
        productId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        cartId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        quantity: {
            type: new DataTypes.INTEGER,
            allowNull: true
        },
        discount: {
            type: new DataTypes.FLOAT,
            allowNull: true
        },
        price: {
            type: new DataTypes.FLOAT,
            allowNull: false
        },
        totalPrice: {
            type: new DataTypes.FLOAT,
            allowNull: false
        },
        createdAt: {
            field: "createdAt",
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            field: "updatedAt",
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "cartProducts",
        timestamps: true,
        modelName: "CartProducts"
    }
);

export default CartProducts;