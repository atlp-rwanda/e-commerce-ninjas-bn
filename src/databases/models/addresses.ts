/* eslint-disable */
import { Model, DataTypes } from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";

export interface AddressAttributes {
    id: string;
    userId: string;
    province: string;
    district: string;
    sector: string;
    street: string;
    createdAt: Date;
    updatedAt: Date;
}

class Addresses extends Model<AddressAttributes> implements AddressAttributes {
    declare id: string;
    declare userId: string;
    declare province: string;
    declare district: string;
    declare sector: string;
    declare street: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Addresses.belongsTo(Users, { foreignKey: "userId", as: "users" });
    }
}

Addresses.init(
    {
        id: {
            type: DataTypes.UUID,
            autoIncrement: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: new DataTypes.UUID,
            allowNull: false
        },
        province: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        district: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        sector: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        street: {
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
        tableName: "addresses",
        timestamps: true,
        modelName: "Addresses"
    }
);

export default Addresses;