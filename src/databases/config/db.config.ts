/* eslint-disable comma-dangle */
import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();
const NODE_ENV: string = process.env.NODE_ENV || "development";
const DB_HOST_MODE: string = process.env.DB_HOST_TYPE || "remote";

/**
 * Get the URI for the database connection.
 * @returns {string} The URI string.
 */
function getDbUri(): string {
  switch (NODE_ENV) {
    case "development":
      return process.env.DATABASE_URL_DEV as string;
    case "test":
      return process.env.DATABASE_URL_TEST as string;
    default:
      return process.env.DATABASE_URL_PRO as string;
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

const sequelizeConnection: Sequelize = new Sequelize(getDbUri(), {
  dialect: "postgres",
  dialectOptions: getDialectOptions(),
  logging: false,
});

export default sequelizeConnection;