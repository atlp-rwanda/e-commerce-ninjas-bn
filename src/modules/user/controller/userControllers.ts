/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import uploadImages from "../../../helpers/uploadImage";
import userRepositories from "../repository/userRepositories";
import authRepositories from "../../auth/repository/authRepositories";

const adminGetUsers = async (req: Request, res: Response) => {
  try {
    const user = await userRepositories.getAllUsers();
    return res.status(httpStatus.OK).json({
      message: "Successfully",
      data: { user: user },
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
      message: "Successfully",
      data: { user: user },
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
    return res.status(httpStatus.OK).json({
      message: "User role updated successfully",
      data: { user: user },
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
    res
      .status(httpStatus.OK)
      .json({ message: "Status updated successfully.", data: { user: user } });
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
      .json({ status: httpStatus.OK, data: { user: user } });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const upload = await uploadImages(req.file);
    const userData = { ...req.body, profilePicture: upload.secure_url };
    const user = await userRepositories.updateUserProfile(
      userData,
      req.user.id
    );
    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, data: { user: user } });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
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
    return res
      .status(httpStatus.OK)
      .json({ message: "Password updated successfully", data: { user: user } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getAllNotifications = async ( req: Request, res: Response ) => {
  try {
    const notifications = await userRepositories.findNotificationsByuserId(req.user.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { notifications: notifications },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getSingleNotification = async ( req: Request, res: Response ) => {
  try {
    const notification = await userRepositories.findNotificationById(req.user.id, req.params.id);
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { notification: notification },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await userRepositories.markNotificationAsRead("id", req.params.id);
    res.status(httpStatus.OK).json({ 
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
      message: "All notifications marked as read",
      data: { notifications: notifications }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
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
  markAllNotificationsAsRead
};