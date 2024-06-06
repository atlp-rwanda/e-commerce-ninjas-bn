import { QueryInterface } from "sequelize";
import { collectionOneId, collectionTwoId, shopOneId } from "../../types/uuid";
module.exports = {
  async up(queryInterface: QueryInterface) {

    await queryInterface.bulkInsert("collection", [
      {
        id: collectionOneId,
        name: "Shoes",
        shopId: shopOneId,
        description: "Shoes",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: collectionTwoId,
        name: "Electronics",
        shopId: shopOneId,
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