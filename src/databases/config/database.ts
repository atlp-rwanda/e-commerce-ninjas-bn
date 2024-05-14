import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "***REMOVED***://code-***REMOVED***:test123@localhost:***REMOVED***/ecommerce"
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
