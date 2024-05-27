/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import authRepositories from "../repository/authRepositories";
import { verifyEmail } from "../../../services/sendEmail";
import { IToken } from "../../../types";

const registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
                const register: UsersAttributes = await userRepositories.registerUser(req.body);
                const token: string = generateToken(register.id);
                const data = { register, token };
                const verifyToken = await authRepositories.createToken(register.id);
                const url = `${process.env.BASE_URL_LOCAL}/api/auth/${register.id}/verify/${verifyToken.verifyToken}`;
                await verifyEmail(register.email, "Verify Email", url);
                const newToken: IToken = {
                        userId: register.id,
                        device: req.headers["user-agent"] || "TEST DEVICE",
                        accessToken: token
                }
                await authRepositories.addToken(newToken);
                res.status(httpStatus.OK).json({ message: "Account created successfully. Please check email to verify account.", data })
        } catch (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }

}

const verifyUser = async (req: Request, res: Response) => {
        try {
                const id: string = req.params.id;
                const token: string = req.params.token;
                await authRepositories.UpdateUserVerified(id);
                await authRepositories.tokenRemove(token)
                res.status(200).json({ status: httpStatus.OK, message: " Account verified successfully." });
        } catch (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }
}

export default { registerUser, verifyUser }