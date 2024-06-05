import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("orders", [
      {
        id: 1,
        userId: 1,
        shopId: 1,
        paymentMethodId: 1,
        amount: 150.0,
        orderDate: new Date("2024-01-01"),
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 2,
        shopId: 1,
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
