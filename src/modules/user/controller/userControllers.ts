// user Controllers
import { Request, Response } from "express";

// Import User repository
import authRepositories from "../../auth/repository/authRepositories";

const updateUserRole = async (req: Request, res: Response) => {
  try {
    await authRepositories.UpdateUserByAttributes("role",req.body.role,"id",req.params.id)
    const updatedUser = await authRepositories.findUserByAttributes("id",req.params.id)
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      new: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user role."
    });
  }
};


export default { updateUserRole };
