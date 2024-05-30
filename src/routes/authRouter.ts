/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from "express";
import googleAuth from "../services/googleAuth";
import authControllers from "../modules/auth/controller/authControllers";
import { validation, isUserExist, isAccountVerified, verifyUserCredentials,verifyGoogleCredentials } from "../middlewares/validation";
import { emailSchema, credentialSchema } from "../modules/auth/validation/authValidations";
import passport from "passport";
const router: Router = Router();

router.use(passport.initialize());
router.use(googleAuth.SESSION)




router.post("/register", validation(credentialSchema), isUserExist, authControllers.registerUser);
router.get("/verify-email/:token", isAccountVerified, authControllers.verifyEmail);
router.post("/send-verify-email", validation(emailSchema), isAccountVerified, authControllers.sendVerifyEmail);
router.post("/login", validation(credentialSchema), verifyUserCredentials, authControllers.loginUser);

router.get("/google", googleAuth.googleVerify);
router.get("/google/callback", googleAuth.googlecallback, verifyGoogleCredentials,authControllers.signInUser);


export default router;