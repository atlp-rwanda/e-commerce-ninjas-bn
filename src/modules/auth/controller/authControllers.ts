/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import uploadImages from "../../../helpers/uploadImage";

const registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
                const result = await uploadImages(req.file);
                req.body.profilePicture = result.secure_url;
                const register:UsersAttributes = await userRepositories.registerUser(req.body);
                const token: string = generateToken(register.id);
                res.status(httpStatus.OK).json({ user: register, token: token })
        }catch(error) {
                console.error("Registration error:", error);
                res.status(500).json({ status: 500, message: error.message || "Internal server error" });
        }
        
}

export default { registerUser }