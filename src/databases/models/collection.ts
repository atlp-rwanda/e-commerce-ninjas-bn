/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import { ICollection } from "../../types";

class Collection extends Model<ICollection> {
    declare id: number;
    declare sellerId: number;
    declare name: string;
    declare description?: string;

    static associate(models: any) {
        Collection.belongsTo(models.Users, { foreignKey: "sellerId", as: "seller" });
        Collection.hasMany(models.Products, { foreignKey: "collectionId", as: "products" });
    }
}

Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
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
        modelName: "Collection"
    }
);

export default Collection;
