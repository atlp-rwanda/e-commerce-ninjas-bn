/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Users, { usersAttributes } from "../databases/models/users";
import { sendEmail } from "../services/sendEmail";
interface ExtendedRequest extends Request {
  user: usersAttributes;
}

const PASSWORD_EXPIRATION_DAYS = Number(process.env.PASSWORD_EXPIRATION_DAYS);
const PASSWORD_RESET_URL = `${process.env.SERVER_URL_PRO}/api/auth/forget-password`;

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const checkPasswordExpiration = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findByPk(req.user.id);
      const now = new Date();
    const passwordExpirationDate = addDays(user.passwordUpdatedAt, PASSWORD_EXPIRATION_DAYS);
    const daysRemaining = Math.floor((passwordExpirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) {
      await sendEmail(
        user.email,
        "Password Expired - Reset Required",
        `Your password has expired. Please reset your password using the following link: ${PASSWORD_RESET_URL}`
      );

      return res.status(httpStatus.FORBIDDEN).json({
        status: httpStatus.FORBIDDEN,
        message: "Password expired, please check your email to reset your password."
      });
    } else if (daysRemaining <= 10) {
      res.setHeader("Password-Expiry-Notification", `Your password will expire in ${daysRemaining} days. Please update your password.`);
    }

    next();
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

export { checkPasswordExpiration };
