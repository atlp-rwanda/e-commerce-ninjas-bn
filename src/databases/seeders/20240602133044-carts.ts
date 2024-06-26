import { QueryInterface } from "sequelize";
import { cartOneId, cartTwoId, userTenId, userTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("carts", [
      {
        id: cartOneId,
        userId: userTwoId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: cartTwoId,
        userId: userTenId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("carts", null, {});
  }
};
