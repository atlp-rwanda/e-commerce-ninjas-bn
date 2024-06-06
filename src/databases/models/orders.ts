/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface OrderAttributes {
    id: number;
    userId: number;
    shopId: number;
    paymentMethodId: number;
    amount: number;
    orderDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    declare id: number;
    declare userId: number;
    declare shopId: number;
    declare paymentMethodId: number;
    declare amount: number;
    declare orderDate: Date;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
        Order.belongsTo(models.Shop, { foreignKey: "shopId", as: "shops" });
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
        userId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        shopId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        paymentMethodId: {
            type: new DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: new DataTypes.DOUBLE,
            allowNull: true
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