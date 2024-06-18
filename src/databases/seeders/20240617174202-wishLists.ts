import { QueryInterface } from "sequelize";
import { wishListOneId, wishListTwoId, userOneId, userTwoId, productOneId, productTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("wishLists", [
      {
        id: wishListOneId,
        productId: productOneId,
        userId: userOneId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: wishListTwoId,
        productId: productTwoId,
        userId: userTwoId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("wishLists", null, {});
  }
};
