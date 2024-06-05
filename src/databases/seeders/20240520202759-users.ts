import { QueryInterface  } from "sequelize"
import { hashPassword } from "../../helpers"
const userOne = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"hyassin509",
  lastName: "assin509",
  email:"admin@gmail.com",
  password: hashPassword("$321!Pass!123$"),
  phone:25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "admin",
  status: "enabled",
  id: 1
}
const userTwo = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: hashPassword("$321!Pass!123$"),
  phone: 1234567890,
  profilePicture: "http://example.com/profile.jpg",
  gender: "male",
  birthDate: "1990-01-01",
  language: "English",
  currency: "USD",
  role: "buyer",
  status: "enabled",
  id: 2
}

const userThree = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"paccy509",
  lastName:"paccy209",
  email:"paccy509@gmail.com",
  password: hashPassword("$321!Pass!123$"),
  phone:25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "buyer",
  status: "enabled",
  id: 3
}

const userFour = {
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"SellerTest",
  lastName:"SellerTest",
  email:"testingseller@gmail.com",
  password: hashPassword("$321!Pass!123$"),
  phone:25089767099,
  profilePicture: "",
  gender: "male",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "seller",
  status: "enabled",
  id: 4
}

const up = (queryInterface: QueryInterface) => queryInterface.bulkInsert("users",[userOne, userTwo, userThree, userFour])

const down = (queryInterface: QueryInterface) => queryInterface.bulkDelete("users",[])
export { up, down }
