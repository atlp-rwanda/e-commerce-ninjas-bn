/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken, verifyToken, hashPassword } from "../../../helpers";
import httpStatus from "http-status";
import authRepositories from "../repository/authRepositories";
import { sendResetPasswordEmail } from "../../../services/sendEmail";

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
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const decodedToken: any = verifyToken(token);
        const userId = decodedToken.id;
        const hashedPassword = await hashPassword(newPassword); 
        await authRepositories.UpdateUserByAttributes("password", hashedPassword, "id", userId);  
        res.status(httpStatus.OK).json({ message: "Password reset successfully." });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export default { requestPasswordReset, resetPassword }
