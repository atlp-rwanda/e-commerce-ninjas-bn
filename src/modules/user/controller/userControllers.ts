import { Request, Response } from "express";
import httpStatus from "http-status";
import authRepositories from "../../auth/repository/authRepositories";

const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = Number(req.params.id);
    const data = await authRepositories.UpdateUserByAttributes("status", req.body.status, "id", userId);
    res.status(httpStatus.OK).json({ message: "Status updated successfully.", data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    await authRepositories.UpdateUserByAttributes("role", req.body.role, "id", req.params.id)
    const updatedUser = await authRepositories.findUserByAttributes("id", req.params.id)
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "User role updated successfully",
      new: updatedUser
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error
    });
  }
};
export default { updateUserStatus,updateUserRole };