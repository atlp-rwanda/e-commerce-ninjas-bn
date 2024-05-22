/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import * as dbConnection from "../config/config"

const db: any = {};
let sequelize: Sequelize;
const basename = path.basename(__filename);
const env: string = process.env.NODE_ENV || "development";
const config: any = dbConnection[env as keyof typeof dbConnection];

if (config.url) {
    sequelize = new Sequelize(config.url, config);
} else {
    sequelize = new Sequelize(config.database!, config.username!, config.password, config);
}

fs.readdirSync(__dirname)
    .filter((file: string) => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts";
    })
    .forEach((file: string) => {
        const modelPath = path.join(__dirname, file);
        const model = require(modelPath)(sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
