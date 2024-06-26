"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const users_1 = __importDefault(require("./users"));
class Sessions extends sequelize_1.Model {
    static associate() {
        Sessions.belongsTo(users_1.default, { foreignKey: "userId", as: "users" });
    }
}
Sessions.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    userId: {
        type: new sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    device: {
        type: new sequelize_1.DataTypes.STRING(280),
        allowNull: true
    },
    token: {
        type: new sequelize_1.DataTypes.STRING(280),
        allowNull: true
    },
    otp: {
        type: new sequelize_1.DataTypes.STRING(280),
        allowNull: true
    },
    otpExpiration: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        field: "createdAt",
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        field: "updatedAt",
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: db_config_1.default,
    tableName: "sessions",
    timestamps: true,
    modelName: "Sessions"
});
exports.default = Sessions;
//# sourceMappingURL=sessions.js.map