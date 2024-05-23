// user Controllers
import { Request,Response } from "express";
import userRepositories from "../repository/userRepositories";
import { generateToken } from "../../../helpers";
import httpStatus from "http-status";


const registerUser = async (req:Request,res:Response):Promise<void> => {
        const register = await userRepositories.registerUser(req.body);
        const token = generateToken(register)
        res.status(httpStatus.OK).json({user:register, token: token})
}

export default {registerUser}