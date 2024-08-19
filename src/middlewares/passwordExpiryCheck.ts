/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Users, { usersAttributes } from "../databases/models/users";
import Settings from "../databases/models/settings";
import { sendEmail } from "../services/sendEmail";
interface ExtendedRequest extends Request {
  user: usersAttributes;
}

const PASSWORD_RESET_URL = `${process.env.SERVER_URL_PRO}/api/auth/forget-password`;

const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

const checkPasswordExpiration = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findByPk(req.user.id);

    if (user.role !== "buyer" && user.role !== "seller") {
      return next();
    }

    const now = new Date();
    const setting = await Settings.findOne({ where: { key: "PASSWORD_EXPIRATION_MINUTES" } });
    const PASSWORD_EXPIRATION_MINUTES = setting ? Number(setting.value) : 90;

    const passwordExpirationDate = addMinutes(user.passwordUpdatedAt, PASSWORD_EXPIRATION_MINUTES);
    const minutesRemaining = Math.floor((passwordExpirationDate.getTime() - now.getTime()) / (1000 * 60));

    if (minutesRemaining <= 0) {
      await sendEmail(
        user.email,
        "Password Expired - Reset Required",
        `Your password has expired. Please reset your password using the following link: ${PASSWORD_RESET_URL}`
      );

      return res.status(httpStatus.FORBIDDEN).json({
        status: httpStatus.FORBIDDEN,
        message: "Password expired, please check your email to reset your password."
      });
    }

    next();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

export { checkPasswordExpiration };
