/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Shops from "./shops";
import Carts from "./carts";

export interface OrderAttributes {
    id: string;
    shopId: string;
    cartId: string;
    paymentMethodId: number;
    orderDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Orders extends Model<OrderAttributes> implements OrderAttributes {
    declare id: string;
    declare cartId: string;
    declare shopId: string;
    declare paymentMethodId: number;
    declare orderDate: Date;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Orders.belongsTo(Shops, { foreignKey: "shopId", as: "shops" });
        Orders.belongsTo(Carts, { foreignKey: "cartId", as: "carts" });
    }
}

Orders.init(
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
        modelName: "Orders"
    }
);

export default Orders;