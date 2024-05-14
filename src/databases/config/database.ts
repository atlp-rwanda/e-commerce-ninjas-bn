import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://code-ninjas:test123@localhost:5432/ecommerce"
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
