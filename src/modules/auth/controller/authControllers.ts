/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import userRepositories from "../repository/authRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";
import { UsersAttributes } from "../../../databases/models/users";
import { IRequest,userInfo } from "../../../types";

import authRepositories from "../repository/authRepositories";
import { sendVerificationEmail } from "../../../services/sendEmail";

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
                await authRepositories.updateUserByAttributes("isVerified", true, "id", req.user.id);
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



const signInUser = async(req:Request,res:Response) => {
    try{
    const {email,firstName,lastName,picture,accToken} = req.user as userInfo;
    const register:UsersAttributes = await authRepositories.createUser({
            email:email,
            firstName:firstName,
            lastName:lastName,
            password: accToken,
            profilePicture:picture,
            isGoogleAccount:true,
            isVerified:true
    });
            
     const token = generateToken(register.id)
     const session = {userId: register.id, device: req.headers["user-device"] , token: token, otp: null };
            await authRepositories.createSession(session);
           
       return res.status(200).json({status:200,token:token});            
    }catch(err){
      return res.status(500).json({status:500,Message:err.message})
    }
}

export default { registerUser, sendVerifyEmail, verifyEmail, loginUser,signInUser }