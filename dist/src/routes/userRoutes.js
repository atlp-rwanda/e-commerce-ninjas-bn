"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = __importDefault(require("../middlewares/validation"));
const authValidations_1 = require("../modules/auth/validation/authValidations");
const authControllers_1 = require("../modules/auth/controller/authControllers");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/login", (0, validation_1.default)(authValidations_1.login), authControllers_1.loginUser);
exports.default = userRoutes;
//# sourceMappingURL=userRoutes.js.map