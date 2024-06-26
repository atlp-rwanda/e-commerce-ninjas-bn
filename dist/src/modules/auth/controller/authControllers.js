"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRepositories_1 = __importDefault(require("../repository/authRepositories"));
const helpers_1 = require("../../../helpers");
const http_status_1 = __importDefault(require("http-status"));
const authRepositories_2 = __importDefault(require("../repository/authRepositories"));
const sendEmail_1 = require("../../../services/sendEmail");
const registerUser = async (req, res) => {
    try {
        const register = await authRepositories_2.default.createUser(req.body);
        const token = (0, helpers_1.generateToken)(register.id);
        const session = {
            userId: register.id,
            device: req.headers["user-device"],
            token: token,
            otp: null
        };
        await authRepositories_2.default.createSession(session);
        await (0, sendEmail_1.sendEmail)(register.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}`);
        res.status(http_status_1.default.CREATED).json({
            message: "Account created successfully. Please check email to verify account.",
            data: { user: register }
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
};
const sendVerifyEmail = async (req, res) => {
    try {
        await (0, sendEmail_1.sendEmail)(req.user.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${req.session.token}`);
        res.status(http_status_1.default.OK).json({
            status: http_status_1.default.OK,
            message: "Verification email sent successfully."
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
};
const verifyEmail = async (req, res) => {
    try {
        await authRepositories_2.default.destroySessionByAttribute("userId", req.user.id, "token", req.session.token);
        await authRepositories_2.default.updateUserByAttributes("isVerified", true, "id", req.user.id);
        res.status(http_status_1.default.OK).json({ status: http_status_1.default.OK, message: "Account verified successfully, now login." });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ status: http_status_1.default.INTERNAL_SERVER_ERROR, message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const token = (0, helpers_1.generateToken)(req.user.id);
        const session = {
            userId: req.user.id,
            device: req.headers["user-device"],
            token: token,
            otp: null
        };
        await authRepositories_1.default.createSession(session);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Logged in successfully", data: { token } });
    }
    catch (err) {
        return res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server error", data: err.message });
    }
};
const logoutUser = async (req, res) => {
    try {
        await authRepositories_2.default.destroySessionByAttribute("userId", req.user.id, "token", req.session.token);
        res.status(http_status_1.default.OK).json({ message: "Successfully logged out" });
    }
    catch (err) {
        return res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: "Internal Server error"
        });
    }
};
const forgetPassword = async (req, res) => {
    try {
        const token = (0, helpers_1.generateToken)(req.user.id);
        const session = {
            userId: req.user.id,
            device: req.headers["user-device"],
            token: token,
            otp: null
        };
        await authRepositories_2.default.createSession(session);
        await (0, sendEmail_1.sendEmail)(req.user.email, "Reset password", `${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}`);
        res.status(http_status_1.default.OK).json({ status: http_status_1.default.OK, message: "Check email for reset password." });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
const resetPassword = async (req, res) => {
    try {
        await authRepositories_2.default.updateUserByAttributes("password", req.user.password, "id", req.user.id);
        res.status(http_status_1.default.OK).json({ status: http_status_1.default.OK, message: "Password reset successfully." });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
const updateUser2FA = async (req, res) => {
    try {
        const user = await authRepositories_2.default.updateUserByAttributes("is2FAEnabled", true, "id", req.user.id);
        res.status(http_status_1.default.OK).json({
            status: http_status_1.default.OK,
            message: "2FA enabled successfully.",
            data: { user: user }
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
};
exports.default = {
    registerUser,
    sendVerifyEmail,
    verifyEmail,
    loginUser,
    forgetPassword,
    resetPassword,
    logoutUser,
    updateUser2FA
};
//# sourceMappingURL=authControllers.js.map