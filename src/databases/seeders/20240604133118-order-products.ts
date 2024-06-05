import { QueryInterface } from "sequelize";
import { orderOneId, orderProductFourId, orderProductThreeId, orderTwoId, productOneId, productTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("order_products", [
      {
        id: orderOneId,
        productId: productOneId,
        orderId: orderOneId,
        quantity: 5,
        discount: 10.0,
        unitPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderTwoId,
        productId: productTwoId,
        orderId: orderOneId,
        quantity: 19,
        discount: 5.0,
        unitPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductThreeId,
        productId: productOneId,
        orderId: orderTwoId,
        quantity: 23,
        discount: 0.0,
        unitPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductFourId,
        productId: productTwoId,
        orderId: orderTwoId,
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