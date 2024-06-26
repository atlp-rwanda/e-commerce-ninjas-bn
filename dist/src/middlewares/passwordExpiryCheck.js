"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordExpiration = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_1 = __importDefault(require("../databases/models/users"));
const sendEmail_1 = require("../services/sendEmail");
const PASSWORD_EXPIRATION_MINUTES = Number(process.env.PASSWORD_EXPIRATION_MINUTES) || 90;
const PASSWORD_RESET_URL = `${process.env.SERVER_URL_PRO}/api/auth/forget-password`;
const addMinutes = (date, minutes) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
};
const checkPasswordExpiration = async (req, res, next) => {
    try {
        const user = await users_1.default.findByPk(req.user.id);
        const now = new Date();
        const passwordExpirationDate = addMinutes(user.passwordUpdatedAt, PASSWORD_EXPIRATION_MINUTES);
        const minutesRemaining = Math.floor((passwordExpirationDate.getTime() - now.getTime()) / (1000 * 60));
        if (minutesRemaining <= 0) {
            await (0, sendEmail_1.sendEmail)(user.email, "Password Expired - Reset Required", `Your password has expired. Please reset your password using the following link: ${PASSWORD_RESET_URL}`);
            return res.status(http_status_1.default.FORBIDDEN).json({
                status: http_status_1.default.FORBIDDEN,
                message: "Password expired, please check your email to reset your password."
            });
        }
        else if (minutesRemaining <= 10) {
            res.setHeader("Password-Expiry-Notification", `Your password will expire in ${minutesRemaining} minutes. Please update your password.`);
        }
        next();
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
};
exports.checkPasswordExpiration = checkPasswordExpiration;
//# sourceMappingURL=passwordExpiryCheck.js.map