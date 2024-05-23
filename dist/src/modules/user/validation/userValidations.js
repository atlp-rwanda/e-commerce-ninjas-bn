"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
// user validations
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    firstName: joi_1.default.string().required().messages({
        "string.base": "First name should be a type of text",
        "string.empty": "First name cannot be an empty field",
        "any.required": "First name is required"
    }),
    lastName: joi_1.default.string().required().messages({
        "string.base": "Last name should be a type of text",
        "string.empty": "Last name cannot be an empty field",
        "any.required": "Last name is required"
    }),
    email: joi_1.default.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    }),
    password: joi_1.default.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password should have a minimum length of 8",
        "string.pattern.base": "Password must contain both letters and numbers",
        "any.required": "Password is required"
    }),
    phone: joi_1.default.number().required().messages({
        "number.base": "Phone number should be a type of number",
        "any.required": "Phone number is required"
    }),
    profilePicture: joi_1.default.string().uri().optional().messages({
        "string.base": "Profile picture should be a type of text",
        "string.uri": "Profile picture must be a valid URI"
    }),
    gender: joi_1.default.string().valid("male", "female", "other").required().messages({
        "string.base": "Gender should be a type of text",
        "any.only": "Gender must be one of [male, female, other]",
        "any.required": "Gender is required"
    }),
    birthDate: joi_1.default.date().iso().required().messages({
        "date.base": "Birth date should be a valid date",
        "date.iso": "Birth date must be in ISO format",
        "any.required": "Birth date is required"
    }),
    language: joi_1.default.string().required().messages({
        "string.base": "Language should be a type of text",
        "string.empty": "Language cannot be an empty field",
        "any.required": "Language is required"
    }),
    currency: joi_1.default.string().required().messages({
        "string.base": "Currency should be a type of text",
        "string.empty": "Currency cannot be an empty field",
        "any.required": "Currency is required"
    }),
    role: joi_1.default.string().valid("buyer", "seller", "admin").required().messages({
        "string.base": "Role should be a type of text",
        "any.only": "Role must be one of [buyer, seller, admin]",
        "any.required": "Role is required"
    })
});
exports.userSchema = userSchema;
//# sourceMappingURL=userValidations.js.map