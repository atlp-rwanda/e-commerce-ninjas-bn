/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { ICollection } from "../../types";

class collection extends Model<ICollection> {
    declare id: number;
    declare sellerId: number;
    declare name: string;
    declare description?: string;
}

collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        sellerId: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
        tableName: "collection",
        modelName: "collection"
    }
);

export default collection;
