import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import { validation, isEmailExist } from "../middlewares/validation";
import { emailSchema, resetPasswordSchema } from "../modules/auth/validation/authValidations";

const router: Router = Router();

router.post("/request-password-reset", validation(emailSchema), isEmailExist, authControllers.requestPasswordReset);
router.post("/reset-password/:token", validation(resetPasswordSchema), authControllers.resetPassword);

export default router;