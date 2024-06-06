import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import {
  validation,
  isUserExist,
  isAccountVerified,
<<<<<<< HEAD
  verifyUserCredentials
=======
  verifyUserCredentials,
  verifyOtp
>>>>>>> e9f6e11 (modifying verify otp to give out meaningfull messages)
} from "../middlewares/validation";
import {
  emailSchema,
  credentialSchema
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
  verifyUserCredentials,
<<<<<<< HEAD
=======
  authControllers.loginUser
);
router.post(
  "/verify-otp/:id",
  validation(otpSchema),
  verifyOtp,
>>>>>>> e9f6e11 (modifying verify otp to give out meaningfull messages)
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


export default router;
