"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.generateRandomCode = exports.hashPassword = exports.comparePassword = exports.decodeToken = exports.generateToken = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET);
};
exports.generateToken = generateToken;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.decodeToken = decodeToken;
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
const hashPassword = (password) => {
    return bcrypt_1.default.hashSync(password, 10);
};
exports.hashPassword = hashPassword;
const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateRandomCode = generateRandomCode;
const generateOTP = () => {
    const otp = generateRandomCode();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    return { otp, expirationTime };
};
exports.generateOTP = generateOTP;
//# sourceMappingURL=index.js.map