import { Router } from "express";
import authControllers from "../modules/auth/controller/authControllers";
import { validation, isUserExist, isAccountVerified, verifyUserCredentials } from "../middlewares/validation";
import { emailSchema, credentialSchema } from "../modules/auth/validation/authValidations";


const router: Router = Router();

router.post("/register", validation(credentialSchema), isUserExist, authControllers.registerUser);
router.get("/verify-email/:token", isAccountVerified, authControllers.verifyEmail);
router.post("/send-verify-email", validation(emailSchema), isAccountVerified, authControllers.sendVerifyEmail);
router.post("/login", validation(credentialSchema), verifyUserCredentials, authControllers.loginUser);


export default router;