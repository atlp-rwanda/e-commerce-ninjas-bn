import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import { isUserExist, validation, isUsersExist, credential } from "../middlewares/validation";
import { userAuthorization } from "../middlewares/authorization";
import { statusSchema, roleSchema, userSchema, changePasswordSchema } from "../modules/user/validation/userValidations";
import upload from "../helpers/multer";

  const router = Router();

  router.get("/admin-get-users", userAuthorization(["admin"]), isUsersExist, userControllers.adminGetUsers);
  router.get("/admin-get-user/:id", userAuthorization(["admin"]), isUserExist, userControllers.adminGetUser);
  router.put("/admin-update-user-status/:id", userAuthorization(["admin"]), validation(statusSchema), isUserExist, userControllers.updateUserStatus);
  router.put("/admin-update-user-role/:id", userAuthorization(["admin"]), validation(roleSchema), isUserExist, userControllers.updateUserRole);

  router.get("/user-get-profile", userAuthorization(["admin", "buyer", "seller"]), userControllers.getUserDetails);
  router.put("/user-update-profile", userAuthorization(["admin", "buyer", "seller"]), upload.single("profilePicture"), validation(userSchema), userControllers.updateUserProfile);
  router.put("/change-password", userAuthorization(["admin", "buyer", "seller"]), validation(changePasswordSchema), credential, userControllers.changePassword);

export default router;