"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const uploadImage_1 = __importDefault(require("../../../helpers/uploadImage"));
const userRepositories_1 = __importDefault(require("../repository/userRepositories"));
const authRepositories_1 = __importDefault(require("../../auth/repository/authRepositories"));
const adminGetUsers = async (req, res) => {
    try {
        const user = await userRepositories_1.default.getAllUsers();
        return res.status(http_status_1.default.OK).json({
            message: "Successfully",
            data: { user: user },
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
const adminGetUser = async (req, res) => {
    try {
        const user = await authRepositories_1.default.findUserByAttributes("id", req.params.id);
        return res.status(http_status_1.default.OK).json({
            message: "Successfully",
            data: { user: user },
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
const updateUserRole = async (req, res) => {
    try {
        const user = await authRepositories_1.default.updateUserByAttributes("role", req.body.role, "id", req.params.id);
        return res.status(http_status_1.default.OK).json({
            message: "User role updated successfully",
            data: { user: user },
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await authRepositories_1.default.updateUserByAttributes("status", req.body.status, "id", userId);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Status updated successfully.", data: { user: user } });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
const getUserDetails = async (req, res) => {
    try {
        const user = await authRepositories_1.default.findUserByAttributes("id", req.user.id);
        res
            .status(http_status_1.default.OK)
            .json({ status: http_status_1.default.OK, data: { user: user } });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
const updateUserProfile = async (req, res) => {
    try {
        const upload = await (0, uploadImage_1.default)(req.file);
        const userData = { ...req.body, profilePicture: upload.secure_url };
        const user = await userRepositories_1.default.updateUserProfile(userData, req.user.id);
        res
            .status(http_status_1.default.OK)
            .json({ status: http_status_1.default.OK, data: { user: user } });
    }
    catch (error) {
        res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({ status: http_status_1.default.INTERNAL_SERVER_ERROR, error: error.message });
    }
};
const changePassword = async (req, res) => {
    try {
        const user = await authRepositories_1.default.updateUserByAttributes("password", req.user.password, "id", req.user.id);
        return res
            .status(http_status_1.default.OK)
            .json({ message: "Password updated successfully", data: { user: user } });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.default = {
    updateUserStatus,
    updateUserRole,
    adminGetUsers,
    adminGetUser,
    updateUserProfile,
    getUserDetails,
    changePassword
};
//# sourceMappingURL=userControllers.js.map