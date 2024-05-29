// user Controllers
import { Request, Response } from "express";

import authRepositories from "../../auth/repository/authRepositories";
import httpStatus from "http-status";

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
      message: "An error occurred while updating the user role."
    });
  }
};


export default { updateUserRole };
