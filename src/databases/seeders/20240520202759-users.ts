import { QueryInterface  } from "sequelize"

const userOne = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"hyassin509",
  lastName: "assin509",
  email:"hyassin509@gmail.com",
  password:"$321!pass!123$",
  phone:25089767899,
  role: "buyer"
}
const userTwo = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"aime509",
  lastName:"aime209",
  email:"aime509@gmail.com",
  password:"$321!pass!123$",
  phone:25089767899,
  role: "buyer"
}

const userThree = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"paccy509",
  lastName:"paccy209",
  email:"paccy509@gmail.com",
  password:"$321!pass!123$",
  phone:25089767899,
  role: "buyer"
}

const up = (queryInterface: QueryInterface) => queryInterface.bulkInsert("users",[userOne, userTwo, userThree])

const down = (queryInterface: QueryInterface) => queryInterface.bulkDelete("users",[])
export { up, down }
