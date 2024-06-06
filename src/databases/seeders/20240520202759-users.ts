import { QueryInterface } from "sequelize";
import { hashPassword } from "../../helpers";
import { userOneId, userTwoId, userThreeId, userFourId, userFiveId } from "../../types/uuid";

import { QueryInterface  } from "sequelize"
import { hashPassword } from "../../helpers"
import { userFourId, userOneId, userThreeId, userTwoId } from "../../types/uuid"
const userOne = {
  id: userOneId,
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
  status: "enabled"
}
const userTwo = {
  id: userTwoId,
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
  status: "enabled"
}

const userThree = {
  id: userThreeId,
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
  status: "enabled"
}

const userFour = {
    id: userFourId,
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "paccy5090",
    lastName: "paccy2090",
    email: "paccy5090@gmail.com",
    password: hashPassword("$321!Pass!123$"),
    phone: 25089767899,
    profilePicture: "",
    gender: "female",
    birthDate: "2014-02-02",
    language: "english",
    currency: "USD",
    role: "seller",
    status: "enabled"
};
const userFive = {
    id: userFiveId,
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "dj5090",
    lastName: "dj2090",
    email: "dj@gmail.com",
    password: hashPassword("$321!Pass!123$"),
    phone: 25089767899,
    profilePicture: "",
    gender: "female",
    birthDate: "2014-02-02",
    language: "english",
    currency: "USD",
    role: "seller",
    status: "enabled"
};

export const up = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert("users", [userOne, userTwo, userThree, userFour, userFive]);
};

export const down = async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("users", {});
};
