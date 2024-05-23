import {validation,isUserExist} from "../middlewares/validation";
import userControllers from "../modules/user/controller/userControllers";
import { Router } from "express";
import {userSchema} from "../modules/user/validation/userValidations";

const router: Router = Router();

router.post("/register", validation(userSchema),isUserExist,userControllers.registerUser);

export default router;