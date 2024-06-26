"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = exports.statisticsSchema = exports.shopSchema = exports.productUpdateSchema = exports.productSchema = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
const joi_1 = __importDefault(require("joi"));
const productSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    description: joi_1.default.string().optional().messages({
        "string.base": "Description must be a string",
    }),
    price: joi_1.default.number().precision(2).required().messages({
        "number.base": "Price must be a number",
        "number.precision": "Price can have up to 2 decimal places",
        "any.required": "Price is required",
    }),
    discount: joi_1.default.string().optional().messages({
        "string.base": "Discount must be a string",
    }),
    category: joi_1.default.string().required().messages({
        "string.base": "Category must be a string",
        "any.required": "Category is required",
    }),
    expiryDate: joi_1.default.date().optional().messages({
        "date.base": "Expiry Date must be a valid date",
    }),
    expired: joi_1.default.boolean().default(false).messages({
        "boolean.base": "Expired must be a boolean",
    }),
    bonus: joi_1.default.string().optional().messages({
        "string.base": "Bonus must be a string",
    }),
    images: joi_1.default.array().min(4).max(8).required().messages({
        "array.base": "Images must be an array of URIs",
        "array.min": "Images must have at least 4 items",
        "array.max": "Images can have up to 8 items",
        "any.required": "Images are required",
    }),
    quantity: joi_1.default.number().integer().min(0).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 0",
        "any.required": "Quantity is required",
    }),
});
exports.productSchema = productSchema;
const productUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    price: joi_1.default.number().optional(),
    discount: joi_1.default.string().optional(),
    category: joi_1.default.string().optional(),
    expiryDate: joi_1.default.date().optional(),
    expired: joi_1.default.boolean().default(false).optional(),
    bonus: joi_1.default.string().optional(),
});
exports.productUpdateSchema = productUpdateSchema;
const shopSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required",
    }),
    description: joi_1.default.string().optional().messages({
        "string.base": "Description must be a string",
    }),
});
exports.shopSchema = shopSchema;
const statisticsSchema = joi_1.default.object({
    startDate: joi_1.default.date().required().messages({
        "date.base": "Start date must be a valid date",
        "any.required": "Start date is required",
    }),
    endDate: joi_1.default.date().required().greater(joi_1.default.ref("startDate")).messages({
        "date.base": "End date must be a valid date",
        "any.required": "End date is required",
        "date.greater": "End date must be greater than start date",
    }),
});
exports.statisticsSchema = statisticsSchema;
const statusSchema = joi_1.default.object({
    status: joi_1.default.string().valid("available", "unavailable").required().messages({
        "string.base": "status must be a string",
        "any.required": "status is required",
        "any.only": "status must be either 'available' or 'unavailable'",
    }),
});
exports.statusSchema = statusSchema;
//# sourceMappingURL=productValidation.js.map