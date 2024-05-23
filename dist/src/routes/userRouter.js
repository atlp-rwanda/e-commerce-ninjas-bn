"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../middlewares/validation");
const userControllers_1 = __importDefault(require("../modules/user/controller/userControllers"));
const express_1 = require("express");
const userValidations_1 = require("../modules/user/validation/userValidations");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.validation)(userValidations_1.userSchema), validation_1.isUserExist, userControllers_1.default.registerUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map