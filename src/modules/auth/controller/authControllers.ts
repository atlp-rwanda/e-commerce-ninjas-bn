import { invalidateToken } from "../repository/authRepositories";
import { Request, Response } from "express";

export const logoutUser = async (req: Request, res: Response)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({message: "Unauthorized"});
    }
    const token = authHeader.split(' ')[1]
    const success = await invalidateToken(token);

    if(!success)return res.status(401).json({message: "internal server error!"});

    res.status(200).json({message: "successfully logged out"})
}