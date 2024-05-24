"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    class Tokens extends sequelize_1.Model {
    }
    Tokens.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: new sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        device: {
            type: new sequelize_1.DataTypes.STRING(280),
            allowNull: false
        },
        accessToken: {
            type: new sequelize_1.DataTypes.STRING(280),
            allowNull: false
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
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "tokens",
        timestamps: true,
        modelName: "Tokens"
    });
    return Tokens;
};
//# sourceMappingURL=tokens.js.map