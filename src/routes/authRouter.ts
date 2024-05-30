import { validation,  isEmailExist } from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import { emailSchema } from "../modules/auth/validation/authValidations";

const router: Router = Router();

router.post("/forgot-password",validation(emailSchema),isEmailExist, authControllers.forgotPassword);



export default router;

