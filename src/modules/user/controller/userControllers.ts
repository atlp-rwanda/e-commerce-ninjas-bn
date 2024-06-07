import { Request, Response } from "express";
import httpStatus from "http-status";
import uploadImages from "../../../helpers/uploadImage";
import userRepositories from "../repository/userRepositories";
import authRepositories from "../../auth/repository/authRepositories";

const adminGetUsers = async (req: Request, res: Response) => {
  try {
    const user = await userRepositories.getAllUsers()
    return res.status(httpStatus.OK).json({
      message: "Successfully",
      data: {user: user}
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
}

const adminGetUser = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.findUserByAttributes("id", req.params.id)
    return res.status(httpStatus.OK).json({
      message: "Successfully",
      data: {user: user}
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
}

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes("role", req.body.role, "id", req.params.id)
    return res.status(httpStatus.OK).json({
      message: "User role updated successfully",
      data: {user: user}
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const user = await authRepositories.updateUserByAttributes("status", req.body.status, "id", userId);
    res.status(httpStatus.OK).json({ message: "Status updated successfully.", data: {user: user} });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
  }
};
const getUserDetails = async (req: Request, res: Response) => {
  try {
      const user = await authRepositories.findUserByAttributes("id", req.user.id);
      res.status(httpStatus.OK).json({status: httpStatus.OK, data:{user:user}});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
  }
}

const updateUserProfile = async (req: Request, res: Response) => {
  try {
      const upload = await uploadImages(req.file);
      const userData = { ...req.body, profilePicture:upload.secure_url };
      const user = await userRepositories.updateUserProfile(userData, req.user.id);
      res.status(httpStatus.OK).json({status:httpStatus.OK, data:{user:user}});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
}


export default { updateUserStatus, updateUserRole, adminGetUsers, adminGetUser, updateUserProfile, getUserDetails };
