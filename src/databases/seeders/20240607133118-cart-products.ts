import { QueryInterface } from "sequelize";
import { cartOneId, cartTwoId, orderOneId, orderProductFourId, orderProductThreeId, orderTwoId, productOneId, productTwoId } from "../../types/uuid";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert("cart_products", [
      {
        id: orderOneId,
        productId: productOneId,
        cartId: cartOneId,
        quantity: 5,
        discount: 10.0,
        price: 30.0,
        totalPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderTwoId,
        productId: productTwoId,
        cartId: cartOneId,
        quantity: 19,
        discount: 5.0,
        price: 100.0,
        totalPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductThreeId,
        productId: productOneId,
        cartId: cartTwoId,
        quantity: 23,
        discount: 0.0,
        price: 30.0,
        totalPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductFourId,
        productId: productTwoId,
        cartId: cartTwoId,
        quantity: 40,
        discount: 15.0,
        price: 100.0,
        totalPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("cart_products", null, {});
  }
};