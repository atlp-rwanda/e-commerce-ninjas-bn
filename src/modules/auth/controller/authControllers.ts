/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";


const registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
                const register:UsersAttributes = await userRepositories.registerUser(req.body);
                const token: string = generateToken(register.id);
                const data = {register, token};
                
                res.status(httpStatus.OK).json({message:"Account created successfully. Please check email to verify account.", data})
        }catch(error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
        }
        
}

export default { registerUser }