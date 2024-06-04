'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        userId: 1,
        paymentMethodId: 1,
        amount: 100.50,
        orderDate: new Date(),
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        paymentMethodId: 2,
        amount: 200.75,
        orderDate: new Date(),
        status: 'Completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};