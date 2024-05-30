import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import { validation, isUserExist,isEmailExist ,isAccountVerified  } from "../middlewares/validation";
import { emailSchema, credentialSchema,resetPasswordSchema } from "../modules/auth/validation/authValidations";

const router: Router = Router();

router.post("/register", validation(credentialSchema), isUserExist, authControllers.registerUser);
router.get("/verify-email/:token", isAccountVerified, authControllers.verifyEmail);
router.post("/send-verify-email", validation(emailSchema), isAccountVerified, authControllers.sendVerifyEmail);
router.post("/request-password-reset", validation(emailSchema), isEmailExist, authControllers.requestPasswordReset);
router.post("/reset-password/:token", validation(resetPasswordSchema), authControllers.resetPassword);

export default router;