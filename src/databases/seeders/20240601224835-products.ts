/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import {
  productOneId,
  productTwoId,
  productThreeId,
  shopOneId,
  shopTwoId,
} from "../../types/uuid";

const productOne = {
  id: productOneId,
  shopId: shopOneId,
  name: "Pizza",
  description: "Description for product 1",
  price: 19.99,
  discount: "10%",
  category: "Category 1",
  expiryDate: new Date("2023-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: ["image1.jpg", "image2.jpg"],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productTwo = {
  id: productTwoId,
  shopId: shopTwoId,
  name: "Bugger",
  description: "Description for product 2",
  price: 19.99,
  discount: "10%",
  category: "Category 1",
  expiryDate: new Date("2023-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: ["image1.jpg", "image2.jpg"],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const productThree = {
  id: productThreeId,
  shopId: shopTwoId,
  name: "Chipps",
  description: "Description for product 3",
  price: 19.99,
  discount: "10%",
  category: "Category 1",
  expiryDate: new Date("2023-12-31"),
  expired: false,
  bonus: "Bonus 1",
  images: ["image1.jpg", "image2.jpg"],
  quantity: 50,
  status: "available",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkInsert("products", [
    productOne,
    productTwo,
    productThree,
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("products", {});
};
