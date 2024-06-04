import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import {
  validation,
  isUserExist,
  isAccountVerified,
  verifyUserCredentials,
  isUserEnabled,
  isGoogleEnabled,
  isUserVerified
} from "../middlewares/validation";
import {
  emailSchema,
  credentialSchema,
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
  userAuthorization(["buyer", "seller", "admin"]),
  authControllers.logoutUser
);

router.get("/google", googleAuth.googleVerify);
router.get(
  "/google/callback",
  googleAuth.authenticateWithGoogle);

router.post("/request-password-reset", validation(emailSchema), authControllers.requestPasswordReset);
router.post("/reset-password/:token", validation(resetPasswordSchema), authControllers.resetPassword);


export default router;