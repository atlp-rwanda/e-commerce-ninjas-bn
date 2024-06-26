"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../types/uuid");
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("orders", [
            {
                id: uuid_1.orderOneId,
                shopId: uuid_1.shopOneId,
                cartId: uuid_1.cartOneId,
                paymentMethodId: 1,
                orderDate: new Date("2024-01-01"),
                status: "completed",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.orderTwoId,
                shopId: uuid_1.shopOneId,
                cartId: uuid_1.cartOneId,
                paymentMethodId: 2,
                orderDate: new Date("2024-01-15"),
                status: "completed",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("orders", null, {});
    }
};
//# sourceMappingURL=20240604133044-orders.js.map