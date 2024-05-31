// user Controllers
import { Request, Response } from "express";

import authRepositories from "../../auth/repository/authRepositories";
import httpStatus from "http-status";

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const data = await authRepositories.updateUserByAttributes(
      "role",
      req.body.role,
      "id",
      req.params.id
    );
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
    const userId: number = Number(req.params.id);
    const data = await authRepositories.updateUserByAttributes(
      "status",
      req.body.status,
      "id",
      userId
    );
    res
      .status(httpStatus.OK)
      .json({ message: "Status updated successfully.", data });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
  }
};

export default { updateUserStatus, updateUserRole };
