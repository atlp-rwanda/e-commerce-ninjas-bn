import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost:5432/${process.env.DATABASE_NAME}`,
);

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

// Database connectivity
