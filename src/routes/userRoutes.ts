import { Router } from "express";
import validation from "../middlewares/validation";
import { login } from "../modules/auth/validation/authValidations";
import { loginUser } from "../modules/auth/controller/authControllers";

const userRoutes = Router();

userRoutes.post("/login", validation(login), loginUser);

export default userRoutes;