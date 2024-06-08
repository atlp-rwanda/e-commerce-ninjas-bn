import { QueryInterface } from "sequelize";
import { hashPassword } from "../../helpers";
import { userOneId, userTwoId, userThreeId, userFourId, userFiveId, userSixId } from "../../types/uuid";

const userOne = {
  id: userOneId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"F Admin",
  lastName: "L Admin",
  email:"admin@gmail.com",
  password: hashPassword("Password@123"),
  phone:25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "admin",
  status: "enabled",
  isVerified: true
}
const userTwo = {
  id: userTwoId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: "F Buyer",
  lastName: "L Buyer",
  email: "buyer@gmail.com",
  password: hashPassword("Password@123"),
  phone: 1234567890,
  profilePicture: "http://example.com/profile.jpg",
  gender: "male",
  birthDate: "1990-01-01",
  language: "English",
  currency: "USD",
  role: "buyer",
  status: "enabled",
  isVerified: true
}

const userThree = {
  id: userThreeId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"F Buyer1",
  lastName:"L Buyer1",
  email:"buyer1@gmail.com",
  password: hashPassword("Password@123"),
  phone:25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "buyer",
  status: "enabled",
  isVerified: true
}

const userFour = {
  id: userFourId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName:"F Seller",
  lastName:"L Seller",
  email:"seller@gmail.com",
  password: hashPassword("Password@123"),
  phone:25089767099,
  profilePicture: "",
  gender: "male",
  birthDate: "2-2-2014",
  language: "english",
  currency: "USD",
  role: "seller",
  status: "enabled",
  isVerified: true
}

const userFive = {
  id: userFiveId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: "dj5090",
  lastName: "dj2090",
  email: "dj@gmail.com",
  password: hashPassword("Password@123"),
  phone: 25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2014-02-02",
  language: "english",
  currency: "USD",
  role: "seller",
  status: "enabled",
  isVerified: true
};

const userSix = {
  id: userSixId,
  createdAt: new Date(),
  updatedAt: new Date(),
  firstName: "F Seller3",
  lastName: "L Seller3",
  email: "seller3@gmail.com",
  password: hashPassword("Password@123"),
  phone: 25089767899,
  profilePicture: "",
  gender: "female",
  birthDate: "2014-02-02",
  language: "english",
  currency: "USD",
  role: "seller",
  status: "enabled",
  isVerified: true
};

export const up = (queryInterface: QueryInterface) => queryInterface.bulkInsert("users",[userOne, userTwo, userThree, userFour, userFive, userSix])

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("users", {});
};