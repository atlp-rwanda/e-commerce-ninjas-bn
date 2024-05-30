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
export default { updateUserStatus };
