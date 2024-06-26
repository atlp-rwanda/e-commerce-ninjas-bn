"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.userSchema = exports.roleSchema = exports.statusSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.statusSchema = joi_1.default.object({
    status: joi_1.default.string().valid("enabled", "disabled").required().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'enabled' or 'disabled'",
        "any.required": "Status is required"
    })
});
exports.roleSchema = joi_1.default.object({
    role: joi_1.default.string().valid("admin", "buyer", "seller").required().messages({
        "any.required": "The 'role' parameter is required.",
        "string.base": "The 'role' parameter must be a string.",
        "any.only": "Only admin, buyer and seller are allowed."
    })
});
exports.userSchema = joi_1.default.object({
    firstName: joi_1.default.string().messages({
        "string.base": "firstName should be a type of text",
        "string.empty": "firstName cannot be an empty field",
        "any.required": "firstName is required"
    }),
    lastName: joi_1.default.string().messages({
        "string.base": "lastName should be a type of text",
        "string.empty": "lastName cannot be an empty field",
        "any.required": "lastName is required"
    }),
    phone: joi_1.default.number().messages({
        "number.base": "phone number should be a type of number",
        "any.required": "phone number is required"
    }),
    profilePicture: joi_1.default.string().uri().optional().messages({
        "string.base": "profilePicture should be a type of text",
        "string.uri": "profilePicture must be a valid URI"
    }),
    gender: joi_1.default.string().valid("male", "female", "other").messages({
        "string.base": "gender should be a type of text",
        "any.only": "gender must be one of [male, female, other]",
        "any.required": "gender is required"
    }),
    birthDate: joi_1.default.date().iso().messages({
        "date.base": "birthDate should be a valid date",
        "date.iso": "birthDate must be in ISO format",
        "any.required": "birthDate is required"
    }),
    language: joi_1.default.string().messages({
        "string.base": "language should be a type of text",
        "string.empty": "language cannot be an empty field",
        "any.required": "language is required"
    }),
    currency: joi_1.default.string().messages({
        "string.base": "currency should be a type of text",
        "string.empty": "currency cannot be an empty field",
        "any.required": "currency is required"
    }),
    role: joi_1.default.string().valid("buyer", "seller", "admin").messages({
        "string.base": "role should be a type of text",
        "any.only": "role must be one of [buyer, seller, admin]",
        "any.required": "role is required"
    })
});
exports.changePasswordSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "Old password should be a type of text",
        "string.empty": "Old password cannot be an empty field",
        "string.pattern.base": "Old password must contain both letters, special character and numbers",
        "any.required": "Old password is required"
    }),
    newPassword: joi_1.default.string().min(8).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "New password should be a type of text",
        "string.empty": "New password cannot be an empty field",
        "string.min": "New password should have a minimum length of 8",
        "string.pattern.base": "New password must contain both letters and numbers",
        "any.required": "New password is required"
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("newPassword")).required().messages({
        "any.only": "Confirm password must match new password",
        "any.required": "Confirm password is required"
    })
});
//# sourceMappingURL=userValidations.js.map