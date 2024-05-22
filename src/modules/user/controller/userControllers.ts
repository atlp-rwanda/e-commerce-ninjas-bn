// user Controllers
import { Request,Response } from "express";
import userRepositories from "../repository/userRepositories";

const registerUser = async (req:Request,res:Response) => {
    try {
        const email:string = req.params.email;
        const userExists = await userRepositories.getUserByEmail(email);
        if (userExists) {
            
        }
    } catch (error) {
        
    }
}