"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = __importDefault(require("../modules/user/controller/userControllers"));
const validation_1 = require("../middlewares/validation");
const authorization_1 = require("../middlewares/authorization");
const userValidations_1 = require("../modules/user/validation/userValidations");
const multer_1 = __importDefault(require("../helpers/multer"));
const router = (0, express_1.Router)();
router.get("/admin-get-users", (0, authorization_1.userAuthorization)(["admin"]), validation_1.isUsersExist, userControllers_1.default.adminGetUsers);
router.get("/admin-get-user/:id", (0, authorization_1.userAuthorization)(["admin"]), validation_1.isUserExist, userControllers_1.default.adminGetUser);
router.put("/admin-update-user-status/:id", (0, authorization_1.userAuthorization)(["admin"]), (0, validation_1.validation)(userValidations_1.statusSchema), validation_1.isUserExist, userControllers_1.default.updateUserStatus);
router.put("/admin-update-user-role/:id", (0, authorization_1.userAuthorization)(["admin"]), (0, validation_1.validation)(userValidations_1.roleSchema), validation_1.isUserExist, userControllers_1.default.updateUserRole);
router.get("/user-get-profile", (0, authorization_1.userAuthorization)(["admin", "buyer", "seller"]), userControllers_1.default.getUserDetails);
router.put("/user-update-profile", (0, authorization_1.userAuthorization)(["admin", "buyer", "seller"]), multer_1.default.single("profilePicture"), (0, validation_1.validation)(userValidations_1.userSchema), userControllers_1.default.updateUserProfile);
router.put("/change-password", (0, authorization_1.userAuthorization)(["admin", "buyer", "seller"]), (0, validation_1.validation)(userValidations_1.changePasswordSchema), validation_1.credential, userControllers_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=userRouter.js.map