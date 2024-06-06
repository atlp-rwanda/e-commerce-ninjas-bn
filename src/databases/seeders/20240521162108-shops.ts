import { QueryInterface } from "sequelize";
import { shopOneId, userFourId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("shops", [
      {
        id: shopOneId,
        userId: userFourId,
        name: "Shop One",
        description: "Description for Shop One",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("shops", null, {});
  }
};
