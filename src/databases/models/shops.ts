/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
export interface ShopAttributes {
    id: number;
    userId: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

    class Shop extends Model<ShopAttributes> implements ShopAttributes {
        declare id: number;
        declare userId: number;
        declare name: string;
        declare description: string;
        declare createdAt: Date;
        declare updatedAt: Date;

        static associate(models: any) {
            Shop.belongsTo(models.Users, { foreignKey: "userId",as: "user" });
        }
    }

    Shop.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: new DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: new DataTypes.STRING(280),
                allowNull: true
            },
            description: {
                type: new DataTypes.STRING(560),
                allowNull: true
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
            tableName: "shops",
            timestamps: true,
            modelName:"Shops"
        }
    );

export default Shop;
