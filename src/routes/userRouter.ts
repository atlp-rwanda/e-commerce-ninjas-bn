
import express from "express";

// Import controller
import userControllers from "../modules/user/controller/userControllers";

// Import Validations
import {validateUpdateUserRole} from "../middlewares/validation"

const userRouter = express.Router();

// Update the users role
userRouter.put("/update-role/:id",validateUpdateUserRole, userControllers.updateUserRole);

export default userRouter;
