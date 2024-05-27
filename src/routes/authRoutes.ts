import { validation, validateParams,validateResetToken, isEmailExist } from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import { emailSchema ,updatePasswordSchema, resetPasswordSchema,tokenSchema } from "../modules/auth/validation/authValidations";

const router: Router = Router();

router.post("/forgot-password",validation(emailSchema),isEmailExist, authControllers.forgotPassword);
router.get("/reset-password/:token",validateParams(tokenSchema), authControllers.verifyResetToken);
router.post("/reset-password", validation(resetPasswordSchema), validateResetToken, authControllers.resetPassword);
router.post("/update-password", validation(updatePasswordSchema), authControllers.updatePassword);

export default router;

