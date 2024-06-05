import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("shops", [
      {
        id: 1,
        userId: 4,
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
