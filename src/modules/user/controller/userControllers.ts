import { Request, Response } from "express";
import { comparePassword, generateToken } from "../../../helpers";
import { findUserByEmail } from "../repository/userRepositories";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (user.length < 1) return res.status(400).json({ status: false, message: "Invalid Email or Password" });
    const passwordMatches = await comparePassword(password, user[0].password)
    if (!passwordMatches) return res.status(400).json({ status: false, message: "Invalid Email or Password" });
    const token = generateToken(user[0].id);
    res.status(200).json({ status: true, message: { token, user } });
}

export { loginUser }