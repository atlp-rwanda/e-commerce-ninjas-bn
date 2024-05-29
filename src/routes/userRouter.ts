import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation,validateUpdateUserRole,updateUserRoleSchema} from "../middlewares/validation";
import { statusSchema } from "../modules/user/validation/userValidations";


const router: Router = Router()

router.put("/admin-update-user-status/:id", validation(statusSchema), isUserExist, userControllers.updateUserStatus);
router.put("/admin-update-role/:id",validation(updateUserRoleSchema),validateUpdateUserRole, userControllers.updateUserRole);

export default router;