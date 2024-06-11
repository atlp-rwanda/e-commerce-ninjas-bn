/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

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

class CartProduct extends Model<CartProductAttributes> implements CartProductAttributes {
    declare id: string;
    declare productId: string;
    declare cartId: string;
    declare quantity: number;
    declare discount: number;
    declare price: number;
    declare totalPrice: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        CartProduct.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
        CartProduct.belongsTo(models.Products, { foreignKey: "productId", as: "products" });
    }
}

CartProduct.init(
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
        tableName: "cart_products",
        timestamps: true,
        modelName: "CartProduct"
    }
);

export default CartProduct;