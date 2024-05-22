import { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";

const encryptPassword = async (password: string) =>{
  return await bcrypt.hash(password, 10);
}

const users = [
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "testUser",
    lastName: "DemoUser",
    email: "testinguser@gmail.com",
    password: "",
    phone: 25089767899,
    role: "buyer"
  },
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "aime509",
    lastName: "aime209",
    email: "aime509@gmail.com",
    password: "",
    phone: 25089767899,
    role: "buyer"
  },
  {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "paccy509",
    lastName: "paccy209",
    email: "paccy509@gmail.com",
    password: "",
    phone: 25089767899,
    role: "buyer"
  }
];

const up = async (queryInterface: QueryInterface) => {
  for (let user of users) {
    user.password = await encryptPassword("P@ssword123");
  }
  return queryInterface.bulkInsert("users", users);
};

const down = (queryInterface: QueryInterface) =>
  queryInterface.bulkDelete("users", []);

export { up, down };