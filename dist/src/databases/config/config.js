"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = {
    test: {
        logging: false,
        dialect: "postgres",
        port: process.env.DATABASE_PORT_TEST,
        host: process.env.DATABASE_HOST_TEST,
        database: process.env.DATABASE_NAME_TEST,
        username: process.env.DATABASE_USERNAME_TEST,
        password: process.env.DATABASE_PASSWORD_TEST,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true
            }
        }
    },
    development: {
        logging: false,
        dialect: "postgres",
        port: process.env.DATABASE_PORT_DEV,
        host: process.env.DATABASE_HOST_DEV,
        database: process.env.DATABASE_NAME_DEV,
        username: process.env.DATABASE_USERNAME_DEV,
        password: process.env.DATABASE_PASSWORD_DEV
    },
    production: {
        logging: false,
        dialect: "postgres",
        url: process.env.DATABASE_URL_PRO,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true
            }
        }
    }
};
//# sourceMappingURL=config.js.map