/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import uploadImages from "../../../helpers/uploadImage";
import userRepositories from "../repository/userRepositories";
import authRepositories from "../../auth/repository/authRepositories";
import { sendEmail } from "../../../services/sendEmail";
import { eventEmitter } from "../../../helpers/notifications";

const adminGetUsers = async (req: Request, res: Response) => {
  try {
    const user = await userRepositories.getAllUsers();
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const adminGetUser = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.findUserByAttributes(
      "id",
      req.params.id
    );
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes(
      "role",
      req.body.role,
      "id",
      req.params.id
    );
    eventEmitter.emit("UserChangeRole",user);
      return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User role updated successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const user = await authRepositories.updateUserByAttributes(
      "status",
      req.body.status,
      "id",
      userId
    );
    eventEmitter.emit("UserChangeStatus", user);
    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, message: "Status updated successfully.", data: { user } });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.findUserByAttributes("id", req.user.id);
    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, data: { user } });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    let profilePicture;
    if (req.file) {
      const upload = await uploadImages(req.file);
      profilePicture = upload.secure_url;
    }
    const userData = { ...req.body, profilePicture };
    const user = await userRepositories.updateUserProfile(
      userData,
      req.user.id
    );
    res
      .status(httpStatus.OK)
      .json({
        status: httpStatus.OK,
        message: "User profile updated successfully",
        data: { user }
      });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const changePassword = async (req: any, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes(
      "password",
      req.user.password,
      "id",
      req.user.id
    );
    eventEmitter.emit("passwordChanged", { userId: req.user.id, message: "Password changed successfully" });
    return res
      .status(httpStatus.OK)
      .json({status:httpStatus.OK,
         message: "Password updated successfully", 
         data: { user } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await userRepositories.findNotificationsByuserId(req.user.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { notifications }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getSingleNotification = async (req: Request, res: Response) => {
  try {
    const notification = await userRepositories.findNotificationById(req.user.id, req.params.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message:"Notification fetched successfully",
      data: { notification },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await userRepositories.markNotificationAsRead("id", req.params.id);
    res.status(httpStatus.OK).json({
      status:httpStatus.OK,
      message: "Notification marked as read",
      data: { notification: notification }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const notifications = await userRepositories.markAllNotificationsAsRead(req.user.id);
    res.status(httpStatus.OK).json({
      status:httpStatus.OK,
      message: "All notifications marked as read",
      data: { notifications }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const submitSellerRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const sellerRequest = await userRepositories.createSellerRequest({
      userId,
      requestStatus: "Pending",
    });

    await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Seller Request",
      `A new seller request has been submitted by user ID: ${userId}.`
    );

    await sendEmail(
      req.user.email,
      "Seller Request Submitted",
      "Your request to become a seller has been submitted successfully. We will notify you once it is reviewed."
    );

    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Seller request submitted successfully",
      data: {sellerRequest},
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const changeUserAddress = async (req: any, res: Response) => {
  try {
    const isAddressFound = await userRepositories.findAddressByUserId(req.user.id)
    let createdAddress;
    if(!isAddressFound){
      createdAddress = await userRepositories.addUserAddress({ ...req.body, userId: req.user.id})
    }
    else {
      createdAddress = await userRepositories.updateUserAddress(req.body, req.user.id)
    }
    return res
      .status(httpStatus.OK)
      .json({status:httpStatus.OK,
         message: `${isAddressFound ? "Address updated successfully" : "Address added successfully"}`, 
         data: { address: createdAddress } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updatePasswordExpirationSetting = async (req: Request, res: Response) => {
  try {    
      const { minutes } = req.body;   
      let setting = await userRepositories.findSettingByKey("PASSWORD_EXPIRATION_MINUTES");  
    if (!setting) {
      setting = await userRepositories.createSetting("PASSWORD_EXPIRATION_MINUTES", minutes);
    } else {
      setting = await userRepositories.updateSettingValue(setting, minutes);
    }
    res.status(httpStatus.OK).json({ message: "Password expiration setting updated successfully." });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};


const getPasswordExpiration = async (req: Request, res: Response) => {
  try {
    const setting = await userRepositories.findSettingByKey("PASSWORD_EXPIRATION_MINUTES");
    if (setting) {
      res.status(200).json({ minutes: setting.value });
    } else {
      res.status(404).json({ message: "Password expiration setting not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch password expiration time." });
  }
};

export default {
  updateUserStatus,
  updateUserRole,
  adminGetUsers,
  adminGetUser,
  updateUserProfile,
  getUserDetails,
  changePassword,
  getAllNotifications,
  getSingleNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  submitSellerRequest,
  changeUserAddress,
  updatePasswordExpirationSetting,
  getPasswordExpiration
};