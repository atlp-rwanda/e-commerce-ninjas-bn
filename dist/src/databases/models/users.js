"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
const helpers_1 = require("../../helpers");
const sessions_1 = __importDefault(require("./sessions"));
const shops_1 = __importDefault(require("./shops"));
class Users extends sequelize_1.Model {
    static associate() {
        Users.hasOne(sessions_1.default, { foreignKey: "userId", as: "sessions" });
        Users.hasOne(shops_1.default, { foreignKey: "userId", as: "shops" });
    }
}
Users.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    profilePicture: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        defaultValue: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM("male", "female"),
        allowNull: true,
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    language: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    isGoogleAccount: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    is2FAEnabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        defaultValue: "enabled",
    },
    passwordUpdatedAt: {
        field: "passwordUpdatedAt",
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        field: "createdAt",
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        field: "updatedAt",
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_config_1.default,
    tableName: "users",
    timestamps: true,
    modelName: "Users",
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await (0, helpers_1.hashPassword)(user.password);
                user.passwordUpdatedAt = new Date();
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await (0, helpers_1.hashPassword)(user.password);
                user.passwordUpdatedAt = new Date();
            }
        },
    },
});
exports.default = Users;
//# sourceMappingURL=users.js.map