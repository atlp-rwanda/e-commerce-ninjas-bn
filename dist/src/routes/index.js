"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Use Routes
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./userRouter"));
const router = (0, express_1.Router)();
router.use("/user", userRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map