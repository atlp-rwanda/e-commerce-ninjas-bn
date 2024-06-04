import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { shopOneId } from "../../types/uuid";

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkInsert("Products", [
    {
      id: uuidv4(),
      name: "Product 1",
      description: "Description for product 1",
      price: 19.99,
      discount: "10%",
      category: "Category 1",
      expiryDate: new Date("2023-12-31"),
      expired: false,
      bonus: "Bonus 1",
      shopId: shopOneId,
      images: ["image1.jpg", "image2.jpg"],
      quantity: 50,
      isAvailable: "available",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.bulkDelete("Products", null, {});
};
