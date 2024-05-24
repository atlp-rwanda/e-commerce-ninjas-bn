import { logoutUser } from "../modules/auth/controller/authControllers";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/logout", logoutUser)

export default userRoutes;