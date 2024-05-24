"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToken = exports.findUserByEmail = void 0;
const models_1 = __importDefault(require("../../../databases/models"));
const { Users, Tokens } = models_1.default;
const findUserByEmail = async (email) => {
    return await Users.findAll({
        where: { email }
    });
};
exports.findUserByEmail = findUserByEmail;
const addToken = async (body) => {
    return await Tokens.create(body);
};
exports.addToken = addToken;
//# sourceMappingURL=authRepositories.js.map