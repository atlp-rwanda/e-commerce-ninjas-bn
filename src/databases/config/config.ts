import dotenv from "dotenv"

dotenv.config()

const commonDatabaseConfig = {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}

const sequelizeConfig = {
  development: {
    ...commonDatabaseConfig,
    url: process.env.DATABASE_URL_DEV
  },
  test: {
    ...commonDatabaseConfig,
    url: process.env.DATABASE_URL_TEST
  },
  production: {
    ...commonDatabaseConfig,
    url: process.env.DATABASE_URL_PRO
  }
}

module.exports = sequelizeConfig