import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("order_products", [
      {
        id: 1,
        productId: 1,
        orderId: 1,
        quantity: 5,
        discount: 10.0,
        unitPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        productId: 2,
        orderId: 1,
        quantity: 19,
        discount: 5.0,
        unitPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        productId: 1,
        orderId: 2,
        quantity: 23,
        discount: 0.0,
        unitPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        productId: 2,
        orderId: 2,
        quantity: 40,
        discount: 15.0,
        unitPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("order_products", null, {});
  }
};