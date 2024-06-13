
// src\middlewares\passwordExpiration.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { addDays, isBefore } from "date-fns";
import Users, { usersAttributes } from "../databases/models/users";

interface ExtendedRequest extends Request {
  user: usersAttributes;
}

const PASSWORD_EXPIRATION_DAYS = Number(process.env.PASSWORD_EXPIRATION_DAYS);

export const checkPasswordExpiration = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findByPk(req.user.id); 

    const now = new Date();
    if (isBefore(addDays(user.updatedAt, PASSWORD_EXPIRATION_DAYS), now)) {
      return res.status(httpStatus.FORBIDDEN).json({
        status: httpStatus.FORBIDDEN,
        message: "Password expired, please update your password."
      });
    }
    next();
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};
