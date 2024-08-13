import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import { isUserExist, validation, isUsersExist, credential, isNotificationsExist, isUserProfileComplete, isSellerRequestExist } from "../middlewares/validation";
import { userAuthorization } from "../middlewares/authorization";
import { statusSchema, roleSchema, userSchema, changePasswordSchema, changeAddressSchema, passwordExpirationTimeSchema } from "../modules/user/validation/userValidations";
import upload from "../helpers/multer";

  const router = Router();

  router.get("/admin-get-users", userAuthorization(["admin"]), isUsersExist, userControllers.adminGetUsers);
  router.get("/admin-get-user/:id", userAuthorization(["admin"]), isUserExist, userControllers.adminGetUser);
  router.put("/admin-update-user-status/:id", userAuthorization(["admin"]), validation(statusSchema), isUserExist, userControllers.updateUserStatus);
  router.put("/admin-update-user-role/:id", userAuthorization(["admin"]), validation(roleSchema), isUserExist, userControllers.updateUserRole);
  router.put("/admin-update-password-expiration", userAuthorization(["admin"]), validation(passwordExpirationTimeSchema), userControllers.updatePasswordExpirationSetting);
  router.get("/admin-get-password-expiration", userAuthorization(["admin"]), userControllers.getPasswordExpiration);

  router.get("/user-get-profile", userAuthorization(["admin", "buyer", "seller"]), userControllers.getUserDetails);
  router.put("/user-update-profile", userAuthorization(["admin", "buyer", "seller"]), upload.single("profilePicture"), validation(userSchema), userControllers.updateUserProfile);
  router.put("/change-password", userAuthorization(["admin", "buyer", "seller"]), validation(changePasswordSchema), credential, userControllers.changePassword);


router.get("/user-get-notifications", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.getAllNotifications);
router.get("/user-get-notification/:id", userAuthorization(["admin", "buyer", "seller"]),isNotificationsExist, userControllers.getSingleNotification);

router.put("/user-mark-notification/:id", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.markNotificationAsRead);
router.put("/user-mark-all-notifications", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.markAllNotificationsAsRead);

router.post("/user-submit-seller-request", userAuthorization(["admin", "buyer", "seller"]), isUserProfileComplete,isSellerRequestExist, userControllers.submitSellerRequest)

router.post("/user-change-address", userAuthorization(["admin", "buyer", "seller"]), validation(changeAddressSchema), userControllers.changeUserAddress);

export default router;