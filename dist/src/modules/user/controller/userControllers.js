"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepositories_1 = __importDefault(require("../repository/userRepositories"));
const helpers_1 = require("../../../helpers");
const http_status_1 = __importDefault(require("http-status"));
const registerUser = async (req, res) => {
    const register = await userRepositories_1.default.registerUser(req.body);
    const token = (0, helpers_1.generateToken)(register);
    res.status(http_status_1.default.OK).json({ user: register, token: token });
};
exports.default = { registerUser };
//# sourceMappingURL=userControllers.js.map