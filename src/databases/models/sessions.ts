/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes} from "sequelize";
import sequelizeConnection from "../config/db.config";
import Users from "./users";

export interface SessionAttributes {
    id: string;
    userId: string;
    device: string;
    token: string;
    otp: string;
    otpExpiration: Date;
    createdAt: Date;
    updatedAt: Date;
}

class Sessions extends Model<SessionAttributes> implements SessionAttributes {
    declare id: string;
    declare userId: string;
    declare device: string;
    declare token: string;
    declare otp: string;
    declare otpExpiration: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate() {
        Sessions.belongsTo(Users, { foreignKey: "userId", as: "users" ,onDelete: "CASCADE"});
    }
}

Sessions.init(
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
        device: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        token: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        otp: {
            type: new DataTypes.STRING(280),
            allowNull: true
        },
        otpExpiration: {
            type: DataTypes.DATE,
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
        tableName: "sessions",
        timestamps: true,
        modelName: "Sessions"
    }
);

export default Sessions;