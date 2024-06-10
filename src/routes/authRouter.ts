import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import {
  validation,
  isUserExist,
  isAccountVerified,
  isUserEnabled,
  verifyUser,
  isSessionExist,
  isGoogleEnabled,
  isUserVerified,
  verifyOtp,
  verifyUserCredentials
} from "../middlewares/validation";
import {
  emailSchema,
  credentialSchema,
  otpSchema,
  is2FAenabledSchema,
  resetPasswordSchema 
} from "../modules/auth/validation/authValidations";
import { userAuthorization } from "../middlewares/authorization";
import googleAuth from "../services/googleAuth";

const router: Router = Router();

router.post(
  "/register",
  validation(credentialSchema),
  isUserExist,
  authControllers.registerUser
);
router.get(
  "/verify-email/:token",
  isAccountVerified,
  authControllers.verifyEmail
);
router.post(
  "/send-verify-email",
  validation(emailSchema),
  isAccountVerified,
  authControllers.sendVerifyEmail
);
router.post(
  "/login",
  validation(credentialSchema),
  isUserVerified,
  isUserEnabled,
  isGoogleEnabled,
  verifyUserCredentials,
  authControllers.loginUser
);

router.post(
  "/logout",
  userAuthorization(["admin", "buyer", "seller"]),
  authControllers.logoutUser
);

router.get("/google", googleAuth.googleVerify);
router.get("/google/callback", googleAuth.authenticateWithGoogle);

router.post(
  "/verify-otp/:id",
  validation(otpSchema),
  verifyOtp,
  authControllers.loginUser
);
router.put(
  "/enable-2f",
  validation(is2FAenabledSchema),
  userAuthorization(["admin", "buyer", "seller"]),
  authControllers.updateUser2FA
);
router.post("/forget-password", validation(emailSchema), verifyUser, authControllers.forgetPassword);
router.put("/reset-password/:token", validation(resetPasswordSchema), verifyUser, isSessionExist, authControllers.resetPassword);

export default router;