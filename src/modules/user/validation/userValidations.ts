// user validations
// validations.ts

import { Request, Response, NextFunction } from "express";

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: "Invalid user ID" });
    return;
  }
  next();
};

export const checkUserExists = async (req: Request, res: Response, next: NextFunction, userRepo) => {
  const id = Number(req.params.id);
  try {
    const user = await userRepo.getSingleUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User doesn't exist." });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
