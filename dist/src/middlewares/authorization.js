"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = exports.userAuthorization = void 0;
const authRepositories_1 = __importDefault(require("../modules/auth/repository/authRepositories"));
const http_status_1 = __importDefault(require("http-status"));
const helpers_1 = require("../helpers");
const userAuthorization = function (roles) {
    return async (req, res, next) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return res
                    .status(http_status_1.default.UNAUTHORIZED)
                    .json({ status: http_status_1.default.UNAUTHORIZED, message: "Not authorized" });
            }
            const decoded = await (0, helpers_1.decodeToken)(token);
            const session = await authRepositories_1.default.findSessionByUserIdAndToken(decoded.id, token);
            if (!session) {
                return res
                    .status(http_status_1.default.UNAUTHORIZED)
                    .json({ status: http_status_1.default.UNAUTHORIZED, message: "Not authorized" });
            }
            const user = await authRepositories_1.default.findUserByAttributes("id", decoded.id);
            if (!user) {
                return res
                    .status(http_status_1.default.UNAUTHORIZED)
                    .json({ status: http_status_1.default.UNAUTHORIZED, message: "Not authorized" });
            }
            if (user.status !== "enabled") {
                return res
                    .status(http_status_1.default.UNAUTHORIZED)
                    .json({ status: http_status_1.default.UNAUTHORIZED, message: "Not authorized" });
            }
            if (!roles.includes(user.role)) {
                return res
                    .status(http_status_1.default.UNAUTHORIZED)
                    .json({ status: http_status_1.default.UNAUTHORIZED, message: "Not authorized" });
            }
            req.user = user;
            req.session = session;
            next();
        }
        catch (error) {
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    };
};
exports.userAuthorization = userAuthorization;
const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            const err = new Error("Authentication error");
            err.data = { message: "No token provided" };
            return next(err);
        }
        const decoded = await (0, helpers_1.decodeToken)(token);
        if (!decoded || typeof decoded !== "object") {
            const err = new Error("Authentication error");
            err.data = { message: "Invalid token" };
            return next(err);
        }
        const session = await authRepositories_1.default.findSessionByUserIdAndToken(decoded.id, token);
        if (!session) {
            const err = new Error("Authentication error");
            err.data = { message: "Session not found or expired" };
            return next(err);
        }
        const user = await authRepositories_1.default.findUserByAttributes("id", decoded.id);
        if (!user) {
            const err = new Error("Authentication error");
            err.data = { message: "User not found" };
            return next(err);
        }
        if (!socket.data) {
            socket.data = {};
        }
        socket.data.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        };
        next();
    }
    catch (error) {
        const err = new Error("Internal server error");
        err.data = { message: "Internal server error" };
        return next(err);
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
//# sourceMappingURL=authorization.js.map