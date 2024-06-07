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
        discount: 0.0,
        price: 30.0,
        totalPrice: 150.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderTwoId,
        productId: productTwoId,
        cartId: cartOneId,
        quantity: 19,
        discount: 0.0,
        price: 1000.0,
        totalPrice: 19000.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductThreeId,
        productId: productOneId,
        cartId: cartTwoId,
        quantity: 20,
        discount: 0.0,
        price: 30.0,
        totalPrice: 600.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: orderProductFourId,
        productId: productTwoId,
        cartId: cartTwoId,
        quantity: 40,
        discount: 0.0,
        price: 100.0,
        totalPrice: 4000.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("cart_products", null, {});
  }
};