"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartSchema = void 0;
/* eslint-disable comma-dangle */
const joi_1 = __importDefault(require("joi"));
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const cartSchema = joi_1.default.object({
    productId: joi_1.default.string().pattern(uuidPattern).required().messages({
        "string.pattern.base": "productId must be a valid UUID",
        "string.empty": "productId is required"
    }),
    quantity: joi_1.default.number().required().messages({
        "number.base": "quantity must be a number",
        "any.required": "quantity is required"
    })
});
exports.cartSchema = cartSchema;
//# sourceMappingURL=cartValidations.js.map