/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import {
  productOneId,
  productTwoId,
  productThreeId,
  shopOneId,
  shopTwoId,
  userFourId,
  userSevenId
} from "../../types/uuid";

const productOne = {
  id: productOneId,
  userId: userFourId,
  shopId: shopOneId,
  name: "Lotion",
  description:
    "Our luxurious lotion store, offering a curated selection of nourishing formulas designed to hydrate and pamper. From silky-smooth textures to delightful fragrances, experience the ultimate in skincare indulgence at our boutique",
  price: 19.99,
  discount: "10%",
  category: "Cosmetics",
  expiryDate: new Date("2025-12-31"),
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
  userId: userSevenId,
  shopId: shopTwoId,
  name: "Pizza",
  description:
    "Our authentic pizza store, where each slice is crafted with love and tradition. From classic Margherita to adventurous toppings, indulge in a culinary journey that delights the senses.",
  price: 19.99,
  discount: "10%",
  category: "Food",
  expiryDate: new Date("2025-12-31"),
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
  userId: userSevenId,
  shopId: shopTwoId,
  name: "Fanta",
  description:
    "Our Fanta store, where fizzy refreshment meets bold fruit sensations. From tangy orange to exotic tropical blends, quench your thirst with our vibrant array of sodas.",
  price: 19.99,
  discount: "10%",
  category: "Drinks",
  expiryDate: new Date("2025-12-31"),
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
