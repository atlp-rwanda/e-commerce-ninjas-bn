"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../types/uuid");
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("cartProducts", [
            {
                id: uuid_1.orderProductOneId,
                productId: uuid_1.productOneId,
                cartId: uuid_1.cartOneId,
                quantity: 5,
                discount: 0.0,
                price: 30.0,
                totalPrice: 150.0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.orderProductTwoId,
                productId: uuid_1.productTwoId,
                cartId: uuid_1.cartOneId,
                quantity: 19,
                discount: 0.0,
                price: 1000.0,
                totalPrice: 19000.0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.orderProductThreeId,
                productId: uuid_1.productOneId,
                cartId: uuid_1.cartTwoId,
                quantity: 20,
                discount: 0.0,
                price: 30.0,
                totalPrice: 600.0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.orderProductFourId,
                productId: uuid_1.productTwoId,
                cartId: uuid_1.cartTwoId,
                quantity: 40,
                discount: 0.0,
                price: 100.0,
                totalPrice: 4000.0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("cartProducts", null, {});
    }
};
//# sourceMappingURL=20240607133118-cartProducts.js.map