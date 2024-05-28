/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import { IRequest, IToken } from "../../../types";


const registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
                const register: UsersAttributes = await userRepositories.registerUser(req.body);
                const token: string = generateToken(register.id);
                const data = { register, token };

                res.status(httpStatus.OK).json({ message: "Account created successfully. Please check email to verify account.", data })
        } catch (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }

}


const loginUser = async (req: Request, res: Response) => {
        try {
                const userId = (req as IRequest).loginUserId;
                const token = generateToken(userId);
                const newToken: IToken = {
                        userId,
                        device: req.headers["user-agent"] || "TEST DEVICE",
                        accessToken: token
                }
                await userRepositories.addToken(newToken);
                res.status(httpStatus.OK).json({ message: "Logged in successfully", data: { token } });
        }
        catch (err) {
                // return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", data: err.message });
        }
}


export default { registerUser, loginUser }