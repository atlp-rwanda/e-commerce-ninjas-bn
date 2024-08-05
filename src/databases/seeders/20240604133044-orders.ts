/* eslint-disable comma-dangle */
import { QueryInterface } from "sequelize";
import { cartOneId, orderOneId, orderTwoId, shopOneId,productTwoId,productOneId, orderThreeId, orderFourId, orderFiveId, orderSixId, orderSevenId, orderEightId, orderNineId, shopTwoId  } from "../../types/uuid";

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
        shippingProcess : "your order have been completed",
        expectedDeliveryDate: new Date("2024-08-01"),
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
        shippingProcess : "your order have reached Kigali in 30 minutes it will be reached to you",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderThreeId,
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
        status: "canceled",
        shippingProcess : "The Order is canceled",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderFourId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-05-15"),
        status: "canceled",
        shippingProcess : "The Order is canceled",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderFiveId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-02-15"),
        status: "completed",
        shippingProcess : "your order have reached Kigali in 30 minutes it will be reached to you",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderSixId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-07-15"),
        status: "completed",
        shippingProcess : "your order have reached Kigali in 30 minutes it will be reached to you",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderSevenId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-07-15"),
        status: "canceled",
        shippingProcess : "The Order is canceled",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderEightId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-07-15"),
        status: "canceled",
        shippingProcess : "The Order is canceled",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderNineId,
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
        shopId: shopTwoId,
        cartId: cartOneId,
        paymentMethodId: 2,
        orderDate: new Date("2024-08-02"),
        status: "canceled",
        shippingProcess : "The Order is canceled",
        expectedDeliveryDate: new Date("2024-08-05"),
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("orders", null, {});
  }
};
