"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encryptPassword = async (password) => {
    return await bcrypt_1.default.hash(password, 10);
};
const users = [
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "testUser",
        lastName: "DemoUser",
        email: "testinguser@gmail.com",
        password: "",
        phone: 25089767899,
        role: "buyer"
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "aime509",
        lastName: "aime209",
        email: "aime509@gmail.com",
        password: "",
        phone: 25089767899,
        role: "buyer"
    },
    {
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: "paccy509",
        lastName: "paccy209",
        email: "paccy509@gmail.com",
        password: "",
        phone: 25089767899,
        role: "buyer"
    }
];
const up = async (queryInterface) => {
    for (const user of users) {
        user.password = await encryptPassword("testingpassword");
    }
    return queryInterface.bulkInsert("users", users);
};
exports.up = up;
const down = (queryInterface) => queryInterface.bulkDelete("users", []);
exports.down = down;
//# sourceMappingURL=20240520202759-users.js.map