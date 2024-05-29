
import express from "express";

// Import controller
import userControllers from "../modules/user/controller/userControllers";

// Import Validations
import {updateUserRoleSchema, validateUpdateUserRole, validation} from "../middlewares/validation"

const userRouter = express.Router();

// Update the users role
userRouter.put("/admin-update-role/:id",validation(updateUserRoleSchema),validateUpdateUserRole, userControllers.updateUserRole);

export default userRouter;
import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation,validateUpdateUserRole} from "../middlewares/validation";
import { statusSchema } from "../modules/user/validation/userValidations";

const router: Router = Router()

router.put("/admin-update-user-status/:id", validation(statusSchema), isUserExist, userControllers.updateUserStatus);

router.put("/update-role/:id",validateUpdateUserRole, userControllers.updateUserRole);

export default router;