import {validation,isUserExist, isAccountVerified} from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import { emailSchema, registerSchema} from "../modules/auth/validation/authValidations";


const router: Router = Router();

router.post("/register", validation(registerSchema), isUserExist, authControllers.registerUser);
router.get("/verify-email/:token", isAccountVerified, authControllers.verifyEmail);
router.post("/send-verify-email", validation(emailSchema), isAccountVerified, authControllers.sendVerifyEmail);


export default router;