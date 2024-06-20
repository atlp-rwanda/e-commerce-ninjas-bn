/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import { cartOneId, orderOneId, orderTwoId, shopOneId,productTwoId,productOneId  } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("orders", [
      {
        id: orderOneId,
        products:JSON.stringify( [
          {
            productId:productOneId,
          status:"pending"
          },
          {
            productId:productTwoId,
          status:"pending"
          },
        ]),
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
        products:JSON.stringify( [
          {
            productId:productOneId,
          status:"pending"
          },
          {
            productId:productTwoId,
          status:"pending"
          }
        ]),
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
