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
    products: any;
    cartId: string;
    paymentMethodId: string;
    orderDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Orders extends Model<OrderAttributes> implements OrderAttributes {
    declare id: string;
    declare cartId: string;
    declare products: any;
    declare shopId: string;
    declare paymentMethodId: string;
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
          products: {
            type: new DataTypes.JSONB,
            allowNull: false
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
            type: new DataTypes.STRING,
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