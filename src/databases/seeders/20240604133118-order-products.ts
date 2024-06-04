'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('order_products', [
      {
        productId: 1,
        orderId: 1,
        quantity: 2,
        discount: 10.0,
        unitPrice: 50.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        orderId: 1,
        quantity: 1,
        discount: 5.0,
        unitPrice: 100.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 3,
        orderId: 2,
        quantity: 3,
        discount: 0.0,
        unitPrice: 30.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 4,
        orderId: 2,
        quantity: 4,
        discount: 15.0,
        unitPrice: 40.0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 5,
        orderId: 3,
        quantity: 2,
        discount: 20.0,
        unitPrice: 20.0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('order_products', null, {});
  }
};