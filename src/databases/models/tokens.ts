/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
export interface TokenAttributes {
    id: number;
    userId: number;
    device: string;
    accessToken: string;
    verifyToken: string;
    createdAt: Date;
    updatedAt: Date;
}

    class Tokens extends Model<TokenAttributes> implements TokenAttributes {
        declare id: number;
        declare userId: number;
        declare device: string;
        declare accessToken: string;
        declare verifyToken:string;
        declare createdAt: Date;
        declare updatedAt: Date;

        static associate(models: any) {
            Tokens.belongsTo(models.Users, { foreignKey: "userId",as: "user" });
        }
    }

    Tokens.init(
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
            device: {
                type: new DataTypes.STRING(280),
                allowNull: true
            },
            accessToken: {
                type: new DataTypes.STRING(280),
                allowNull: true
            },
            verifyToken: {
                type: new DataTypes.STRING(280),
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
            tableName: "tokens",
            timestamps: true,
            modelName:"Tokens"
        }
    );

export default Tokens;