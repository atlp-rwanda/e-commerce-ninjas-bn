/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface OrderAttributes {
    id: number;
    shopId: number;
    cartId: number;
    paymentMethodId: number;
    orderDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    declare id: number;
    declare cartId: number;
    declare shopId: number;
    declare paymentMethodId: number;
    declare orderDate: Date;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Order.belongsTo(models.Shop, { foreignKey: "shopId", as: "shop" });
        Order.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
    }
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
        shopId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        cartId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        paymentMethodId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        },
        orderDate: {
            type: new DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: new DataTypes.STRING,
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
        tableName: "orders",
        timestamps: true,
        modelName: "Order"
    }
);

export default Order;