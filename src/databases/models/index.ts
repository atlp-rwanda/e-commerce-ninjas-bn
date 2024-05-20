import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export class SequelizeConnection {
  private static instance: Sequelize;

  private constructor() {
    const dbName = process.env.DB_NAME as string;
    const dbUser = process.env.DB_USER as string;
    const dbHost = process.env.DB_HOST;
    const dbDriver = process.env.DB_DRIVER as Dialect;
    const dbPassword = process.env.DB_PASSWORD;

    SequelizeConnection.instance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      dialect: dbDriver,
    });

    SequelizeConnection.instance.authenticate().then(() => {
      console.log("Database connected");
    });
  }

  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      new SequelizeConnection();
    }

    return SequelizeConnection.instance;
  }
}
