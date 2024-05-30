import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import {
  validation,
  isUserExist,
  isAccountVerified,
  verifyUserCredentials,
  is2FAenabled,
  verifyOtp
} from "../middlewares/validation";
import {
  emailSchema,
  credentialSchema,
  otpSchema
} from "../modules/auth/validation/authValidations";


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
  verifyUserCredentials,
  is2FAenabled,
  authControllers.loginUser
);
router.post(
  "/verify-otp/:id",
  validation(otpSchema),
  verifyOtp,
  authControllers.loginUser
);

export default router;
