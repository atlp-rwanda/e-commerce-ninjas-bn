import dotenv from 'dotenv'
dotenv.config()

module.exports = {
    test: {
        logging: false,
        dialect: '***REMOVED***',
        port: process.env.DATABASE_PORT,
        host:  process.env.DATABASE_HOST,
        database:  process.env.DATABASE_NAME,
        username:  process.env.DATABASE_USERNAME,
        password:  process.env.DATABASE_PASSWORD,
    },

    development: {
        logging: false,
        dialect: '***REMOVED***',
        port: process.env.DATABASE_PORT,
        host:  process.env.DATABASE_HOST,
        database:  process.env.DATABASE_NAME,
        username:  process.env.DATABASE_USERNAME,
        password:  process.env.DATABASE_PASSWORD,
    },

    production: {
        logging: false,
        dialect: '***REMOVED***',
        port: process.env.DATABASE_PORT,
        host:  process.env.DATABASE_HOST,
        database:  process.env.DATABASE_NAME,
        username:  process.env.DATABASE_USERNAME,
        password:  process.env.DATABASE_PASSWORD,
    }
}