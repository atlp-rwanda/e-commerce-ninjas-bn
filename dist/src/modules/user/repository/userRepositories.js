"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const index_1 = __importDefault(require("../../../databases/models/index"));
const { Users } = index_1.default;
const registerUser = async (body) => {
    return await Users.create(body);
};
const findUserByEmail = async (email) => {
    return await Users.findOne({ where: { email: email } });
};
exports.default = { registerUser, findUserByEmail };
//# sourceMappingURL=userRepositories.js.map