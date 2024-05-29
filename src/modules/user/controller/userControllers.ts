// user Controllers
import { Request, Response } from "express";

// Import User repository
import userRepositories from "../repository/userRepositories";

const updateUserRole = async (req: Request, res: Response) => {
  const id = req.params.id;
  const role = req.body.role;
  try {
    await userRepositories.updateUserRoleFx(Number(id), String(role));
    const updatedUser = await userRepositories.getSingleUserFx(Number(id));
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      new: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user role."
    });
  }
};


export default { updateUserRole };
