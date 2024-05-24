import { validation, isAccountExist } from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import { emailSchema ,updatePasswordSchema, resetPasswordSchema, authSchema,loginSchema } from "../modules/auth/validation/authValidations";

const router: Router = Router();

router.post("/register", validation(authSchema), isAccountExist, authControllers.registerUser);
router.post("/login", validation(loginSchema), authControllers.login);
router.post("/forgot-password", validation(emailSchema), authControllers.forgotPassword);
router.get("/reset-password/:token", authControllers.verifyResetToken);
router.post("/reset-password", validation(resetPasswordSchema), authControllers.resetPassword);
router.post("/update-password", validation(updatePasswordSchema), authControllers.updatePassword);

export default router;
