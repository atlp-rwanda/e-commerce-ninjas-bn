import {validation,isUserExist} from "../middlewares/validation";
import authControllers from "../modules/auth/controller/authControllers";
import { Router } from "express";
import {authSchema} from "../modules/auth/validation/authValidations";
import upload from "../helpers/multer";

const router: Router = Router();

router.post("/register", upload.single("profilePicture"), validation(authSchema), isUserExist, authControllers.registerUser);


export default router;