/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { ICollection } from "../../types";

class collection extends Model<ICollection> {
    declare id: number;
    declare shopId: number;
    declare name: string;
    declare description?: string;
}

collection.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
        shopId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: "shops",
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
