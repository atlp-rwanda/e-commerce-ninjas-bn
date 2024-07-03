/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import wishLists from "./wishLists";
import Products from "./products";


export interface wishListProductAttributes {
    id: string;
    wishListId: string;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

class wishListProducts extends Model<wishListProductAttributes> implements wishListProductAttributes {
    [x: string]: any;
    declare id: string;
    declare productId: string;
    declare wishListId: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        wishListProducts.belongsTo(wishLists, { foreignKey: "wishListId", as: "wishLists" });
        wishListProducts.belongsTo(Products, { foreignKey: "productId", as: "products" });
    }
}

wishListProducts.init(
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
        wishListId: {
            type: new DataTypes.UUID,
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
        tableName: "wishListProducts",
        timestamps: true,
        modelName: "wishListProducts"
    }
);

export default wishListProducts;