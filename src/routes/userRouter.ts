import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation} from "../middlewares/validation";
import { statusSchema,roleSchema } from "../modules/user/validation/userValidations";


const router: Router = Router()

router.put("/admin-update-user-status/:id", validation(statusSchema), isUserExist, userControllers.updateUserStatus);
router.put("/admin-update-role/:id",validation(roleSchema),isUserExist, userControllers.updateUserRole);

export default router;