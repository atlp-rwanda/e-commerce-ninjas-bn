import { QueryInterface } from "sequelize";
import { orderOneId, orderTwoId, shopOneId, userOneId, userTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("orders", [
      {
        id: orderOneId,
        userId: userOneId,
        shopId: shopOneId,
        paymentMethodId: 1,
        amount: 150.0,
        orderDate: new Date("2024-01-01"),
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderTwoId,
        userId: userTwoId,
        shopId: shopOneId,
        paymentMethodId: 2,
        amount: 200.0,
        orderDate: new Date("2024-01-15"),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("orders", null, {});
  }
};
