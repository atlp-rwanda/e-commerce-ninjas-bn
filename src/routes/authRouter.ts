import { validation, isUserExist, checkLoginUser } from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import { authSchema, loginSchema } from "../modules/auth/validation/authValidations";


const router: Router = Router();

router.post("/register", validation(authSchema), isUserExist, authControllers.registerUser);
router.post("/login", validation(loginSchema), checkLoginUser, authControllers.loginUser);


export default router;