"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../types/uuid");
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("carts", [
            {
                id: uuid_1.cartOneId,
                userId: uuid_1.userTwoId,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: uuid_1.cartTwoId,
                userId: uuid_1.userTenId,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("carts", null, {});
    }
};
//# sourceMappingURL=20240602133044-carts.js.map