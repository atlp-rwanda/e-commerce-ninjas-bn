"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: async (queryInterface) => {
        await queryInterface.createTable("sessions", {
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
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
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: sequelize_1.DataTypes.NOW
            }
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("sessions");
    }
};
//# sourceMappingURL=20240523180022-create-sessions.js.map