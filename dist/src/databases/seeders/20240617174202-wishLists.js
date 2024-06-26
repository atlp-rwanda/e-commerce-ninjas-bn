"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../types/uuid");
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("wishLists", [
            {
                id: uuid_1.wishListOneId,
                productId: uuid_1.productOneId,
                userId: uuid_1.userOneId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.wishListTwoId,
                productId: uuid_1.productTwoId,
                userId: uuid_1.userTwoId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("wishLists", null, {});
    }
};
//# sourceMappingURL=20240617174202-wishLists.js.map