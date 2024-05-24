import { Request, Response } from "express";
import { comparePassword, generateToken } from "../../../helpers";
import { addToken, findUserByEmail } from "../repository/authRepositories";
import { ILogin, IToken } from "../../../../types";
import httpStatus from "http-status";

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password }: ILogin = req.body;
        const user = await findUserByEmail(email);
        if (user.length < 1) return res.status(httpStatus.BAD_REQUEST).json({ status: false, message: "Invalid Email or Password" });
        const passwordMatches = await comparePassword(password, user[0].password)
        if (!passwordMatches) return res.status(httpStatus.BAD_REQUEST).json({ status: false, message: "Invalid Email or Password" });
        const token = generateToken(user[0].id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const newToken: IToken = {
            userId: user[0].id,
            device: req.headers["user-agent"] || "TEST DEVICE",
            accessToken: token,
            expiresAt
        }
        await addToken(newToken);
        res.status(httpStatus.OK).json({ status: true, message: { token, user } });
    }
    catch (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message });
    }
}

export { loginUser }