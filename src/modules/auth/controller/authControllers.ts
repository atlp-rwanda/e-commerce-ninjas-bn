/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken, verifyToken, hashPassword } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import authRepositories from "../repository/authRepositories";
import { sendVerificationEmail, sendResetPasswordEmail } from "../../../services/sendEmail";

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const register: UsersAttributes = await userRepositories.createUser(req.body);
        const token: string = generateToken(register.id);
        const session = { userId: register.id, device: req.headers["user-device"], token: token, otp: null };
        await authRepositories.createSession(session);
        await sendVerificationEmail(register.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}`);
        res.status(httpStatus.CREATED).json({ message: "Account created successfully. Please check email to verify account.", data: { user: register } });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create account." });
    }
}

const sendVerifyEmail = async (req: any, res: Response): Promise<void> => {
    try {
        await sendVerificationEmail(req.user.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${req.session.token}`);
        res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Verification email sent successfully." });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to send verification email." });
    }
}

const verifyEmail = async (req: any, res: Response): Promise<void> => {
    try {
        await authRepositories.destroySession(req.user.id, req.session.token);
        await authRepositories.UpdateUserByAttributes("isVerified", true, "id", req.user.id);
        res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Account verified successfully, now login." });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to verify account." });
    }
}

const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await userRepositories.findUserByAttributes("email", email);

        if (!user) {
            res.status(httpStatus.NOT_FOUND).json({ message: "User not found." });
            return;
        }

        const token = generateToken(user.id);
        const resetLink = `${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}`;
        await sendResetPasswordEmail(user.email, "Password Reset Request", resetLink);
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

        await authRepositories.UpdateUserPasswordById(userId, hashedPassword);
        res.status(httpStatus.OK).json({ message: "Password reset successfully." });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to reset password." });
    }
}

export default { registerUser, sendVerifyEmail, verifyEmail, requestPasswordReset, resetPassword }
