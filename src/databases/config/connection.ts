import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_LINK);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
};

export const syncDatabase = async () => {
  sequelize.sync({ force: true });
};

export default sequelize;