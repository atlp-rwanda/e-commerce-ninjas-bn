import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import {
  validation,
  isUserExist,
  isAccountVerified,
  verifyUserCredentials,
  verifyUser,
  isSessionExist, credential
} from "../middlewares/validation";
import userControllers from "../modules/user/controller/userControllers";
import {
  emailSchema,
  credentialSchema,
  resetPasswordSchema 
} from "../modules/auth/validation/authValidations";
import {  updatePasswordSchema } from "../modules/user/validation/userValidations";
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
  verifyUserCredentials,
  authControllers.loginUser
);

router.post(
  "/logout",
  userAuthorization(["admin", "buyer", "seller"]),
  authControllers.logoutUser
);

router.get("/google", googleAuth.googleVerify);
router.get(
  "/google/callback",
  googleAuth.authenticateWithGoogle);

router.post("/request-reset-password", validation(emailSchema), verifyUser, authControllers.requestResetPassword);
router.post("/reset-password/:token", validation(resetPasswordSchema), verifyUser, isSessionExist, authControllers.resetPassword);
router.put("/update-password", validation(updatePasswordSchema), credential, userControllers.updatePassword);

export default router;