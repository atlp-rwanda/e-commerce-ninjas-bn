import {validation,isUserExist, isUserVerified} from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import {authSchema} from "../modules/auth/validation/authValidations";


const router: Router = Router();

router.post("/register", validation(authSchema), isUserExist, authControllers.registerUser);
router.get("/:id/verify/:token",isUserVerified, authControllers.verifyUser);

export default router;