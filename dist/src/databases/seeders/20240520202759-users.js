"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const userOne = {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "hyassin509",
    lastName: "assin509",
    email: "hyassin509@gmail.com",
    password: "$321!pass!123$",
    phone: 25089767899,
    profilePicture: "",
    gender: "female",
    birthDate: "2-2-2014",
    language: "english",
    currency: "USD",
    role: "buyer"
};
const userTwo = {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: 1234567890,
    profilePicture: "http://example.com/profile.jpg",
    gender: "male",
    birthDate: "1990-01-01",
    language: "English",
    currency: "USD",
    role: "buyer"
};
const userThree = {
    createdAt: new Date(),
    updatedAt: new Date(),
    firstName: "paccy509",
    lastName: "paccy209",
    email: "paccy509@gmail.com",
    password: "$321!pass!123$",
    phone: 25089767899,
    profilePicture: "",
    gender: "female",
    birthDate: "2-2-2014",
    language: "english",
    currency: "USD",
    role: "buyer"
};
const up = (queryInterface) => queryInterface.bulkInsert("users", [userOne, userTwo, userThree]);
exports.up = up;
const down = (queryInterface) => queryInterface.bulkDelete("users", []);
exports.down = down;
//# sourceMappingURL=20240520202759-users.js.map