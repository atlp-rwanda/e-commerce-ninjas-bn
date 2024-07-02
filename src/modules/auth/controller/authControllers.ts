/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken} from "../../../helpers";
import httpStatus from "http-status";
import { usersAttributes } from "../../../databases/models/users";
import authRepositories from "../repository/authRepositories";
import { sendEmail } from "../../../services/sendEmail";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const register: usersAttributes = await authRepositories.createUser(
      req.body
    );
    const token: string = generateToken(register.id);
    const session = {
      userId: register.id,
      device: req.headers["user-device"],
      token: token,
      otp: null
    };
    await authRepositories.createSession(session);
    await sendEmail(
      register.email,
      "Verification Email",
      `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}`
    );
    res.status(httpStatus.CREATED).json({
      message:
        "Account created successfully. Please check email to verify account.",
      data: { user: register }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  }
};

const sendVerifyEmail = async (req: any, res: Response) => {
  try {
    await sendEmail(
      req.user.email,
      "Verification Email",
      `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${req.session.token}`
    );
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Verification email sent successfully."
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  }
};

const verifyEmail = async (req: any, res: Response) => {
  try {
    await authRepositories.destroySessionByAttribute(
      "userId",
      req.user.id,
      "token",
      req.session.token
    );
    await authRepositories.updateUserByAttributes("isVerified", true, "id", req.user.id);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Account verified successfully, now login." });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
}

const loginUser = async (req: any, res: Response) => {
  try {
    const token = generateToken(req.user.id);
    const session = {
      userId: req.user.id,
      device: req.headers["user-device"],
      token: token,
      otp: null
    };
    await userRepositories.createSession(session);
    res
      .status(httpStatus.OK)
      .json({ message: "Logged in successfully", data: { token } });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server error", data: err.message });
  }
};

const logoutUser = async (req: any, res: Response) => {
  try {
    await authRepositories.destroySessionByAttribute(
      "userId",
      req.user.id,
      "token",
      req.session.token
    );
    res.status(httpStatus.OK).json({ message: "Successfully logged out" });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server error"
      });
  }
};
const forgetPassword = async (req: any, res: Response): Promise<void> => {
  try {
      const token = generateToken(req.user.id);
      const session = {
        userId: req.user.id,
        device: req.headers["user-device"],
        token: token,
        otp: null
      };
      await authRepositories.createSession(session);
      await sendEmail(req.user.email, "Reset password", `${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}`);
      res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Check email for reset password."});
  } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

const resetPassword = async (req: any, res: Response): Promise<void> => {
  try {
    await authRepositories.updateUserByAttributes("password", req.user.password, "id", req.user.id);  
      res.status(httpStatus.OK).json({status: httpStatus.OK, message: "Password reset successfully." });
  } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const updateUser2FA = async (req: any, res: Response) => {
  try {
    const user = await authRepositories.updateUserByAttributes(
      "is2FAEnabled",
      true,
      "id",
      req.user.id
    );
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "2FA enabled successfully.",
      data: { user: user }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  }
};
export default {
  registerUser,
  sendVerifyEmail,
  verifyEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  logoutUser,
  updateUser2FA
};