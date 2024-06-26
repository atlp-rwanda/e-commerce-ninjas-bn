import { QueryInterface } from "sequelize";
import { cartOneId, orderOneId, orderTwoId, shopOneId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("orders", [
      {
        id: orderOneId,
        shopId: shopOneId,
        cartId: cartOneId,
        paymentMethodId: 1,
        orderDate: new Date("2024-01-01"),
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderTwoId,
        shopId: shopOneId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-01-15"),
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("orders", null, {});
  }
};
