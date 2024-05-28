import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation,validateUpdateUserRole} from "../middlewares/validation";
import { statusSchema } from "../modules/user/validation/userValidations";


const router: Router = Router()

router.put("/admin-update-user-status/:id", validation(statusSchema), isUserExist, userControllers.updateUserStatus);

router.put("/update-role/:id",validateUpdateUserRole, userControllers.updateUserRole);

export default router;