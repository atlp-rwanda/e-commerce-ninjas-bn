"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
(0, dotenv_1.config)();
const NODE_ENV = process.env.NODE_ENV || "development";
const DB_HOST_MODE = process.env.DB_HOST_TYPE || "remote";
/**
 * Get the URI for the database connection.
 * @returns {string} The URI string.
 */
function getDbUri() {
    switch (NODE_ENV) {
        case "development":
            return process.env.DATABASE_URL_DEV;
        case "test":
            return process.env.DATABASE_URL_TEST;
        default:
            return process.env.DATABASE_URL_PRO;
    }
}
/**
 * Get dialect options for Sequelize.
 * @returns {DialectOptions} The dialect options.
 */
function getDialectOptions() {
    return DB_HOST_MODE === "local"
        ? {}
        : {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        };
}
const sequelizeConnection = new sequelize_1.Sequelize(getDbUri(), {
    dialect: "postgres",
    dialectOptions: getDialectOptions(),
    logging: false,
});
exports.default = sequelizeConnection;
//# sourceMappingURL=db.config.js.map