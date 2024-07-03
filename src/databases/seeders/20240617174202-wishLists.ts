import { QueryInterface } from "sequelize";
import { wishListOneId, wishListTwoId,  userEightId, userThreeId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("wishLists", [
      {
        id: wishListOneId,
        userId: userEightId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: wishListTwoId,
        userId: userThreeId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("wishLists", null, {});
  }
};
