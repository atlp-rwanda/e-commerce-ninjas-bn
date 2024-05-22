import { Router } from 'express';
import validation from '../middlewares/validation';
import userValidations from '../modules/user/validation/userValidations';
import { loginUser } from '../modules/user/controller/userControllers';

const userRoutes = Router();

userRoutes.post("/login", validation(userValidations.login), loginUser);

export default userRoutes;