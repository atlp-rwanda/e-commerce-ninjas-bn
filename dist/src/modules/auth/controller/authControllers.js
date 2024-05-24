"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const helpers_1 = require("../../../helpers");
const authRepositories_1 = require("../repository/authRepositories");
const http_status_1 = __importDefault(require("http-status"));
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, authRepositories_1.findUserByEmail)(email);
        if (user.length < 1)
            return res.status(http_status_1.default.BAD_REQUEST).json({ status: false, message: "Invalid Email or Password" });
        const passwordMatches = await (0, helpers_1.comparePassword)(password, user[0].password);
        if (!passwordMatches)
            return res.status(http_status_1.default.BAD_REQUEST).json({ status: false, message: "Invalid Email or Password" });
        const token = (0, helpers_1.generateToken)(user[0].id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const newToken = {
            userId: user[0].id,
            device: req.headers["user-agent"] || "TEST DEVICE",
            accessToken: token,
            expiresAt
        };
        await (0, authRepositories_1.addToken)(newToken);
        res.status(http_status_1.default.OK).json({ status: true, message: { token, user } });
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=authControllers.js.map