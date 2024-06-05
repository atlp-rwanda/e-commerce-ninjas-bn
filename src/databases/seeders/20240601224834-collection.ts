import { QueryInterface } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {

    await queryInterface.bulkInsert("collection", [
      {
        id: 1,
        name: "Shoes",
        sellerId: 1,
        description: "Shoes",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Electronics",
        sellerId: 2,
        description: "Electronics",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("collection", null, {})
  }
}