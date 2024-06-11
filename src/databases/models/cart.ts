/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface CartAttributes {
    id: string;
    userId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

class Cart extends Model<CartAttributes> implements CartAttributes {
    declare id: string;
    declare userId: string;
    declare status: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Cart.belongsTo(models.Users, { foreignKey: "userId", as: "buyer" });
    }
}

Cart.init(
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
        modelName: "Cart"
    }
);

export default Cart;