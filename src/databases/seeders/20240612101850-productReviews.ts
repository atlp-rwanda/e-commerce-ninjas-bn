import { QueryInterface } from "sequelize";
import { productOneId, productTwoId, userTwoId, userOneId, productReviewOneId, productReviewTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("productReviews", [
      {
        id: productReviewOneId,
        productId: productOneId,
        userId: userOneId,
        feedback: "Excellent Product and Service!",
        rating: 4,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: productReviewTwoId,
        productId: productTwoId,
        userId: userTwoId,
        feedback: "very well",
        rating: 3,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("productReviews", null, {});
  }
};