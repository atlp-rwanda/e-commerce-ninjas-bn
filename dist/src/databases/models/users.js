"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
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
            allowNull: false
        },
        phone: {
            type: new sequelize_1.DataTypes.BIGINT,
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
            defaultValue: false
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
        modelName: "Users"
    });
    return Users;
};
//# sourceMappingURL=users.js.map