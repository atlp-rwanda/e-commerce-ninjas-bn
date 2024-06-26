"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commonDatabaseConfig = {
    dialect: "postgres",
};
const sequelizeConfig = {
    development: {
        ...commonDatabaseConfig,
        url: process.env.DATABASE_URL_DEV,
    },
    test: {
        ...commonDatabaseConfig,
        url: process.env.DATABASE_URL_TEST,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
    production: {
        ...commonDatabaseConfig,
        url: process.env.DATABASE_URL_PRO,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
module.exports = sequelizeConfig;
//# sourceMappingURL=config.js.map