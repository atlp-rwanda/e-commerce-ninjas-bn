import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import {isUserExist, validation,isUsersExist} from "../middlewares/validation";
import { userAuthorization } from "../middlewares/authorization";
import { statusSchema,roleSchema ,userSchema} from "../modules/user/validation/userValidations";
import upload from "../helpers/multer";

const router: Router = Router()

router.get("/admin-get-users",userAuthorization(["admin"]), isUsersExist, userControllers.adminGetUsers);
router.get("/admin-get-user/:id",userAuthorization(["admin"]), isUserExist, userControllers.adminGetUser)
router.put("/admin-update-user-status/:id",userAuthorization(["admin"]), validation(statusSchema), isUserExist, userControllers.updateUserStatus);
router.put("/admin-update-role/:id",userAuthorization(["admin"]), validation(roleSchema),isUserExist, userControllers.updateUserRole);

router.get("/user-get-profile/:id",userControllers.getUserDetails)
router.put("/user-update-profile/:id",userAuthorization(["buyer", "seller", "admin"]),upload.single("profilePicture"),validation(userSchema),userControllers.updateUserProfile)


export default router;