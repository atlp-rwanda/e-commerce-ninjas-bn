import { Router } from "express";
import userControllers from "../modules/user/controller/userControllers";
import { isUserExist, validation, isUsersExist, credential, isNotificationsExist, isUserProfileComplete, isSellerRequestExist, isRequestAcceptedOrRejected } from "../middlewares/validation";
import { userAuthorization } from "../middlewares/authorization";
import { statusSchema, roleSchema, userSchema, changePasswordSchema, changeAddressSchema } from "../modules/user/validation/userValidations";
import upload from "../helpers/multer";

  const router = Router();

  router.get("/admin-get-users", userAuthorization(["admin"]), isUsersExist, userControllers.adminGetUsers);
  router.get("/admin-get-user/:id", userAuthorization(["admin"]), isUserExist, userControllers.adminGetUser);
  router.put("/admin-update-user-status/:id", userAuthorization(["admin"]), validation(statusSchema), isUserExist, userControllers.updateUserStatus);
  router.put("/admin-update-user-role/:id", userAuthorization(["admin"]), validation(roleSchema), isUserExist, userControllers.updateUserRole);
  router.get("/admin-get-users-request", userAuthorization(["admin"]),isSellerRequestExist,userControllers.adminGetAllSellerRequested);
  router.get("/admin-get-user-request/:userId", userAuthorization(["admin"]),isSellerRequestExist,userControllers.adminGetRequestDetails);
  router.put("/admin-accept-or-reject-request/:userId", userAuthorization(["admin"]),isSellerRequestExist,isRequestAcceptedOrRejected,userControllers.adminAcceptOrDenyRequest);
  router.delete("/admin-delete-user-request/:userId/:id", userAuthorization(["admin"]),isSellerRequestExist,userControllers.adminDeleteSellerRequest);

  router.get("/user-get-profile", userAuthorization(["admin", "buyer", "seller"]), userControllers.getUserDetails);
  router.put("/user-update-profile", userAuthorization(["admin", "buyer", "seller"]), upload.single("profilePicture"), validation(userSchema), userControllers.updateUserProfile);
  router.put("/change-password", userAuthorization(["admin", "buyer", "seller"]), validation(changePasswordSchema), credential, userControllers.changePassword);

router.get("/user-get-notifications", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.getAllNotifications);
router.get("/user-get-notification/:id", userAuthorization(["admin", "buyer", "seller"]),isNotificationsExist, userControllers.getSingleNotification);

router.put("/user-mark-notification/:id", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.markNotificationAsRead);
router.put("/user-mark-all-notifications", userAuthorization(["admin", "buyer", "seller"]), isNotificationsExist, userControllers.markAllNotificationsAsRead);

router.post("/user-submit-seller-request", userAuthorization(["admin", "buyer", "seller"]),upload.single("file"), isUserProfileComplete,isSellerRequestExist, userControllers.submitSellerRequest)

router.post("/user-change-address", userAuthorization(["admin", "buyer", "seller"]), validation(changeAddressSchema), userControllers.changeUserAddress);

export default router;