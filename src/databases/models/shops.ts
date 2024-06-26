/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { IShops } from "../../types";
import Users from "./users";
import Products from "./products";

class Shops extends Model<IShops> {
    declare id: string;
    declare userId: string;
    declare name: string;
    declare description?: string;

    static associate() {
        Shops.belongsTo(Users, { foreignKey: "userId", as: "users" });
        Shops.hasMany(Products, { foreignKey: "shopId", as: "products" });
    }
}

Shops.init(
    {
        id: {
            type: DataTypes.UUID,
            autoIncrement: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "shops",
        modelName: "Shops"
    }
);

export default Shops;