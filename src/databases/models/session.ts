/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import { Model, DataTypes} from "sequelize";
import sequelizeConnection from "../config/db.config";

export interface SessionAttributes {
    id: number;
    userId: number;
    device: string;
    token: string;
    otp: string;
    createdAt: Date;
    updatedAt: Date;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
    declare id: number;
    declare userId: number;
    declare device: string;
    declare token: string;
    declare otp: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Session.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
    }
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: new DataTypes.INTEGER,
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

export default Session;
