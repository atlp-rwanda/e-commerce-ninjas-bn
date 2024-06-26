"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const uuid_1 = require("../../types/uuid");
const shopOne = {
    id: uuid_1.shopOneId,
    name: "Paccy Shop 250",
    userId: uuid_1.userFourId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
};
const shopTwo = {
    id: uuid_1.shopTwoId,
    name: "Paccy Shop 509",
    userId: uuid_1.userSevenId,
    description: "Selling",
    createdAt: new Date(),
    updatedAt: new Date()
};
const up = async (queryInterface) => {
    await queryInterface.bulkInsert("shops", [shopOne, shopTwo]);
};
exports.up = up;
const down = async (queryInterface) => {
    await queryInterface.bulkDelete("shops", {});
};
exports.down = down;
//# sourceMappingURL=20240601224834-shops.js.map