"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
module.exports = (sequelize) => {
    class Users extends sequelize_1.Model {
    }
    Users.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        lastName: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        password: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            defaultValue: "url"
        },
        phone: {
            type: new sequelize_1.DataTypes.BIGINT,
            allowNull: false
        },
        profilePicture: {
            type: new sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"
        },
        gender: {
            type: new sequelize_1.DataTypes.ENUM("male", "female"),
            allowNull: false
        },
        birthDate: {
            type: new sequelize_1.DataTypes.DATEONLY,
            allowNull: false
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        currency: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        role: {
            type: new sequelize_1.DataTypes.STRING(128),
            allowNull: false
        },
        isVerified: {
            type: new sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is2FAEnabled: {
            type: new sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: new sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        sequelize,
        tableName: "users",
        timestamps: true,
        modelName: "Users",
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt_1.default.hash(user.password, 10);
            }
        }
    });
    return Users;
};
//# sourceMappingURL=users.js.map