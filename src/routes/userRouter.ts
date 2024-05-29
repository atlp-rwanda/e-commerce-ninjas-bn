
import express from "express";

// Import controller
import userControllers from "../modules/user/controller/userControllers";

// Import Validations
import {updateUserRoleSchema, validateUpdateUserRole, validation} from "../middlewares/validation"

const userRouter = express.Router();

// Update the users role
userRouter.put("/admin-update-role/:id",validation(updateUserRoleSchema),validateUpdateUserRole, userControllers.updateUserRole);

export default userRouter;
