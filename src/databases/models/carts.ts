/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import CartProducts from "./cartProducts";
import Users from "./users";
import Orders from "./orders";

export interface CartAttributes {
    id: string;
    userId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Carts extends Model<CartAttributes> implements CartAttributes {
    [x: string]: any;
    declare id: string;
    declare userId: string;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Carts.belongsTo(Users, { foreignKey: "userId", as: "buyer" });
        Carts.hasMany(CartProducts, { foreignKey: "cartId", as: "cartProducts" });
        Carts.hasMany(Orders,{foreignKey: "cartId", as: "orders"})
    }
}

Carts.init(
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
        tableName: "carts",
        timestamps: true,
        modelName: "Carts"
    }
);

export default Carts;