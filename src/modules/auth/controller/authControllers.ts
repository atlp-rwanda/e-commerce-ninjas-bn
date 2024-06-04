/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken,hashPassword, verifyToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import authRepositories from "../repository/authRepositories";
import { sendEmail } from "../../../services/sendEmail";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const register: UsersAttributes = await authRepositories.createUser(
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
      message: error.message
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
      message: error.message
    });
  }
};

const verifyEmail = async (req: any, res: Response) => {
  try {
    await authRepositories.destroySession(req.user.id, req.session.token)
    await authRepositories.updateUserByAttributes("isVerified", true, "id", req.user.id);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Account verified successfully, now login." });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
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
    await authRepositories.destroySession(req.user.id, req.session.token)
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

const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
      const { email } = req.body;
      const user = await userRepositories.findUserByAttributes("email", email);
      const token = generateToken(user.id);
      const resetLink = `${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}`;
      await sendEmail(user.email, "Password Reset Request", resetLink);
      res.status(httpStatus.OK).json({ message: "Password reset email sent successfully." });
  } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const decodedToken: any = verifyToken(token);
      const userId = decodedToken.id;
      const hashedPassword = await hashPassword(newPassword); 
      await authRepositories.updateUserByAttributes("password", hashedPassword, "id", userId);  
      res.status(httpStatus.OK).json({ message: "Password reset successfully." });
  } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export default {
  registerUser,
  sendVerifyEmail,
  verifyEmail,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPassword 
};