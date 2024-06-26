"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.is2FAenabledSchema = exports.otpSchema = exports.emailSchema = exports.credentialSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const credentialSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.base": "email should be a type of text",
        "string.email": "email must be a valid email",
        "string.empty": "email cannot be an empty field",
        "any.required": "email is required"
    }),
    password: joi_1.default.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "password is required"
    })
});
exports.credentialSchema = credentialSchema;
const emailSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.base": "email should be a type of text",
        "string.email": "email must be a valid email",
        "string.empty": "email cannot be an empty field",
        "any.required": "email is required"
    })
});
exports.emailSchema = emailSchema;
const otpSchema = joi_1.default.object({
    otp: joi_1.default.number().integer().required().messages({
        "number.base": "OTP must be a 6-digit number",
        "number.empty": "OTP cannot be an empty field",
        "any.required": "OTP is required"
    })
});
exports.otpSchema = otpSchema;
const is2FAenabledSchema = joi_1.default.object({
    is2FAEnabled: joi_1.default.boolean().required().messages({
        "boolean.base": "2FAenabled must be a boolean",
        "boolean.empty": "2FAenabled cannot be an empty field",
        "any.required": "2FAenabled is required"
    })
});
exports.is2FAenabledSchema = is2FAenabledSchema;
const resetPasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain at least uppercase letter,lowercase letter, number, and special character",
        "any.required": "password is required"
    })
});
exports.resetPasswordSchema = resetPasswordSchema;
//# sourceMappingURL=authValidations.js.map