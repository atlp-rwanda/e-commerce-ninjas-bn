"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = __importDefault(require("../modules/auth/controller/authControllers"));
const validation_1 = require("../middlewares/validation");
const authValidations_1 = require("../modules/auth/validation/authValidations");
const authorization_1 = require("../middlewares/authorization");
const googleAuth_1 = __importDefault(require("../services/googleAuth"));
const passwordExpiryCheck_1 = require("../middlewares/passwordExpiryCheck");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_1.validation)(authValidations_1.credentialSchema), validation_1.isUserExist, authControllers_1.default.registerUser);
router.get("/verify-email/:token", validation_1.isAccountVerified, authControllers_1.default.verifyEmail);
router.post("/send-verify-email", (0, validation_1.validation)(authValidations_1.emailSchema), validation_1.isAccountVerified, authControllers_1.default.sendVerifyEmail);
router.post("/login", (0, validation_1.validation)(authValidations_1.credentialSchema), validation_1.isUserVerified, validation_1.isUserEnabled, validation_1.isGoogleEnabled, validation_1.verifyUserCredentials, passwordExpiryCheck_1.checkPasswordExpiration, authControllers_1.default.loginUser);
router.post("/logout", (0, authorization_1.userAuthorization)(["admin", "buyer", "seller"]), authControllers_1.default.logoutUser);
router.get("/google", googleAuth_1.default.googleVerify);
router.get("/google/callback", googleAuth_1.default.authenticateWithGoogle);
router.post("/verify-otp/:id", (0, validation_1.validation)(authValidations_1.otpSchema), validation_1.verifyOtp, authControllers_1.default.loginUser);
router.put("/enable-2f", (0, validation_1.validation)(authValidations_1.is2FAenabledSchema), (0, authorization_1.userAuthorization)(["admin", "buyer", "seller"]), authControllers_1.default.updateUser2FA);
router.post("/forget-password", (0, validation_1.validation)(authValidations_1.emailSchema), validation_1.verifyUser, authControllers_1.default.forgetPassword);
router.put("/reset-password/:token", (0, validation_1.validation)(authValidations_1.resetPasswordSchema), validation_1.verifyUser, validation_1.isSessionExist, authControllers_1.default.resetPassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map