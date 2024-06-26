import { QueryInterface } from "sequelize";
import { wishListProductsOneId,wishListProductsTwoId, wishListOneId, wishListTwoId, productOneId, productTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("wishListProducts", [
      {
        id: wishListProductsOneId,
        productId: productOneId,
        wishListId: wishListOneId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: wishListProductsTwoId,
        productId: productTwoId,
        wishListId: wishListTwoId,
        createdAt: new Date(),
        updatedAt: new Date()
      }      
    ], {});
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("wishListProducts", null, {});
  }
};