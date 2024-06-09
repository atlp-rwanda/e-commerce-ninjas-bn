import { QueryInterface } from "sequelize";
import { productOneId, productTwoId, shopOneId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("Products", [
      {
        id: productOneId,
        name: "Product 1",
        description: "Description for product 1",
        price: 30.0,
        discount: "0%",
        category: "Category 1",
        expiryDate: new Date("2023-12-31"),
        expired: false,
        bonus: "Bonus 1",
        shopId: shopOneId,
        images: ["image1.jpg", "image2.jpg"],
        quantity: 300,
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: productTwoId,
        name: "Product 2",
        description: "Description for product 2",
        price: 1000.0,
        discount: "0%",
        category: "Category 2",
        expiryDate: new Date("2024-12-31"),
        expired: false,
        bonus: "Bonus 2",
        shopId:shopOneId,
        images: ["image3.jpg", "image4.jpg"],
        quantity: 200,
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("Products", null, {});
  }
};