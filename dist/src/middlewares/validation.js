"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const validation = (schema) => async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ""));
        return res.status(http_status_1.default.BAD_REQUEST).json({ status: false, message: errorMessages });
    }
    return next();
};
exports.default = validation;
//# sourceMappingURL=validation.js.map