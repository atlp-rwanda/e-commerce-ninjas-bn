/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface OrderProductAttributes {
    id: number;
    productId: number;
    orderId: number;
    quantity: number;
    discount: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

class OrderProduct extends Model<OrderProductAttributes> implements OrderProductAttributes {
    declare id: number;
    declare productId: number;
    declare orderId: number;
    declare quantity: number;
    declare discount: number;
    declare unitPrice: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        OrderProduct.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
        OrderProduct.belongsTo(models.Product, { foreignKey: "productId", as: "Products" });
    }
}

OrderProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        productId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        },
        orderId: {
            type: new DataTypes.INTEGER,
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
        unitPrice: {
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
        tableName: "order_products",
        timestamps: true,
        modelName: "OrderProduct"
    }
);

export default OrderProduct;