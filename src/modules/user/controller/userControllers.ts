// user Controllers
import { Request,Response } from "express";
import userRepositories from "../repository/userRepositories";

const registerUser = async (req:Request,res:Response):Promise<void> => {
    try {
        const email:string = req.params.email;
        const userExists = await userRepositories.getUserByEmail(email);
        if (userExists) {
            res.status(200).json({message: "User already exists"});
        }
        if (req.body.password.length < 8 || !/\d/.test(req.body.password) || !/[a-zA-Z]/.test(req.body.password)) {
            res.status(400).json({ error: "Password must be at least 8 characters long and contain both letters and numbers." });
          }
        const register = await userRepositories.registerUser(req.body);
        if (register) {
            res.json(register)
        }
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).send({ error: "Email is already in use." });
          }
          res.status(400).send(error);
        }
    }


export default {registerUser}