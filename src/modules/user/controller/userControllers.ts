import { Request, Response } from "express";
import httpStatus from "http-status";
import userRepositories from "../repository/userRepositories";
import authRepositories from "../../auth/repository/authRepositories";

const adminGetUsers = async (req:Request, res:Response) =>{
  try {
    const data = await userRepositories.getAllUsers()
    return res.status(httpStatus.OK).json({
      message: "Successfully",
      data
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
}

const adminGetUser = async (req:Request, res:Response) =>{
  try {
    const data = await authRepositories.findUserByAttributes("id", req.params.id)
    return res.status(httpStatus.OK).json({
      message: "Successfully",
      data
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
    const data = await authRepositories.updateUserByAttributes("role", req.body.role, "id", req.params.id)
    return res.status(httpStatus.OK).json({
      message: "User role updated successfully",
      data
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
    const data = await authRepositories.updateUserByAttributes("status", req.body.status, "id", userId);
    res.status(httpStatus.OK).json({ message: "Status updated successfully.", data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};



export default { updateUserStatus, updateUserRole, adminGetUsers , adminGetUser };