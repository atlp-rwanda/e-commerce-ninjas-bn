"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserExist = exports.validation = void 0;
const userRepositories_1 = __importDefault(require("../modules/user/repository/userRepositories"));
const http_status_1 = __importDefault(require("http-status"));
const validation = (schema) => async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ""));
        return res.status(http_status_1.default.BAD_REQUEST).json({ status: http_status_1.default.BAD_REQUEST, message: errorMessages });
    }
    return next();
};
exports.validation = validation;
const isUserExist = async (req, res, next) => {
    const { email } = req.body;
    const userExists = await userRepositories_1.default.findUserByEmail(email);
    if (userExists) {
        return res.status(http_status_1.default.BAD_REQUEST).json({ status: http_status_1.default.BAD_REQUEST, message: "User already exists." });
    }
    return next();
};
exports.isUserExist = isUserExist;
//# sourceMappingURL=validation.js.map