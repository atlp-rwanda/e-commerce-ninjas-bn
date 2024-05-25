/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken, hashPassword, comparePassword, generateResetToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import { sendForgotPasswordEmail, sendPasswordChangeEmail } from "../../../services/sendEmail";
import authRepositories from "../repository/authRepositories";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const register: UsersAttributes = await userRepositories.registerUser(req.body);
        const token: string = generateToken(register.id);
        res.status(httpStatus.OK).json({ user: register, token: token });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error });
    }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const email: string = req.body.email;
        const resetToken = generateResetToken();
        const resetPasswordExpires = new Date(Date.now() + 3600000);
        await authRepositories.updateUser(req.user!.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetPasswordExpires
        });

        await sendForgotPasswordEmail(email, resetToken, req.user!.firstName);

        res.status(httpStatus.OK).json({ status: true, message: "Password reset email sent" });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};


const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const user: UsersAttributes | null = await authRepositories.findUserByResetToken(token);

        if (!user || user.resetPasswordExpires! < new Date()) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Token is invalid or has expired" });
            return;
        }

        res.status(httpStatus.OK).json({ status: true, message: "Token is valid" });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { newPassword } = req.body;
        const user = req.user as UsersAttributes;

        const hashedPassword = await hashPassword(newPassword);

        await authRepositories.updateUser(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        await sendPasswordChangeEmail(user.email, user.firstName);

        res.status(httpStatus.OK).json({ status: true, message: "Password has been reset" });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        const user = await authRepositories.findUserById(userId);

        if (!user) {
            res.status(httpStatus.NOT_FOUND).json({ status: false, message: "User not found" });
            return;
        }

        const isOldPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isOldPasswordValid) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Old password is incorrect" });
            return;
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await authRepositories.updateUserPassword(userId, hashedNewPassword);

        await sendPasswordChangeEmail(user.email, user.firstName);

        res.status(httpStatus.OK).json({ status: true, message: "Password updated successfully" });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await authRepositories.findUserByEmail(email);

        if (!user) {
            res.status(httpStatus.NOT_FOUND).json({ status: false, message: "User not found" });
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Wrong password" });
            return;
        }

        const passwordExpirationTime = 45 * 60 * 1000;
        const passwordLastChanged = user.lastPasswordChange || user.createdAt;
        const passwordExpired = new Date(passwordLastChanged.getTime() + passwordExpirationTime) < new Date();

        if (passwordExpired) {
            res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Password expired, please change your password before login" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(httpStatus.OK).json({ status: true, message: "Login successful", token: token });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

export default { registerUser, login, forgotPassword, verifyResetToken, resetPassword, updatePassword };
