/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken, verifyToken , hashPassword } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import { IRequest } from "../../../types";

import authRepositories from "../repository/authRepositories";
import { sendVerificationEmail, sendResetPasswordEmail } from "../../../services/sendEmail";

const registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
                const register: UsersAttributes = await userRepositories.createUser(req.body);
                const token: string = generateToken(register.id);
                const session = { userId: register.id, device: req.headers["user-device"], token: token, otp: null };
                await authRepositories.createSession(session);
                await sendVerificationEmail(register.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${token}`);
                res.status(httpStatus.CREATED).json({ message: "Account created successfully. Please check email to verify account.", data: { user: register } })
        } catch (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }

}

const sendVerifyEmail = async (req: any, res: Response) => {
        try {
                await sendVerificationEmail(req.user.email, "Verification Email", `${process.env.SERVER_URL_PRO}/api/auth/verify-email/${req.session.token}`);
                res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Verification email sent successfully." });
        } catch (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }
}

const verifyEmail = async (req: any, res: Response) => {
        try {
                await authRepositories.destroySession(req.user.id, req.session.token)
                await authRepositories.UpdateUserByAttributes("isVerified", true, "id", req.user.id);
                res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Account verified successfully, now login." });
        } catch (error) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }
}


const loginUser = async (req: Request, res: Response) => {
        try {
                const userId = (req as IRequest).loginUserId;
                const token = generateToken(userId);
                const session = { userId, device: req.headers["user-device"], token: token, otp: null };
                await userRepositories.createSession(session);
                res.status(httpStatus.OK).json({ message: "Logged in successfully", data: { token } });
        }
        catch (err) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", data: err.message });
        } 
}

const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const user = await userRepositories.findUserByAttributes("email", email);
            const token = generateToken(user.id);
            const resetLink = `${process.env.SERVER_URL_PRO}/api/auth/reset-password/${token}`;
    
            await sendResetPasswordEmail(user.email, "Password Reset Request", resetLink);
    
            res.status(httpStatus.OK).json({ message: "Password reset email sent successfully." });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };
    

    const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params;
            const decodedToken: any = verifyToken(token);
    
            if (!decodedToken || decodedToken.exp < Math.floor(Date.now() / 1000)) {

                res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid or expired token." });
                return;
            }
    
            // Token is valid
            res.status(httpStatus.OK).json({ message: "Token is valid.", userId: decodedToken.id });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };
    

    const resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
    
            const decodedToken: any = verifyToken(token);
            const userId = decodedToken.id;
    
            // Hash the new password
            const hashedPassword = await hashPassword(newPassword); // Assuming you have a hashPassword function
    
            // Update password with the hashed password
            await authRepositories.UpdateUserPasswordById(userId, hashedPassword);
    
            res.status(httpStatus.OK).json({ message: "Password reset successfully." });
        } catch (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };



export default { registerUser, sendVerifyEmail, verifyEmail, loginUser, requestPasswordReset, resetPassword, verifyResetToken  }