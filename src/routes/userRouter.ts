import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation} from "../middlewares/validation";
import { statusSchema,roleSchema , userSchema} from "../modules/user/validation/userValidations";
import upload from "../helpers/multer";
import { userAuthorization } from "../middlewares/authorization";

const router: Router = Router()

router.put("/admin-update-user-status/:id", validation(statusSchema), isUserExist, userControllers.updateUserStatus);
router.put("/admin-update-role/:id",validation(roleSchema),isUserExist, userControllers.updateUserRole);

router.get("/user-get-profile/:id",userControllers.getUserDetails)
router.put("/user-update-profile/:id",userAuthorization(["buyer", "seller", "admin"]),upload.single("profilePicture"),validation(userSchema),userControllers.updateUserProfile)

export default router;