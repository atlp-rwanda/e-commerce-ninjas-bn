/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Users, { UsersAttributes } from "../databases/models/users";

const SECRET: string = process.env.JWT_SECRET;

interface ExtendedRequest extends Request {
  user: UsersAttributes;
}

export const protect = async function (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    //? 1. Get token and check if it's there
    let token: string;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ").at(-1);
    }

    if (!token) throw new Error("Login to get access to this resource");

    //? 2. Validate the token to see if it is valid or if it has not expired
    const decoded: any = await jwt.verify(token, SECRET);

    //? 3. Check if the user still exists
    const user = await Users.findByPk(decoded.id);
    if (!user) {
      throw new Error("User belonging to this token does not exist");
    }

    //?4. Grant access to the protected route
    req.user = user;
    next();
  } catch (err: any) {
    console.log(err);
    let message: string;
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      message = "Invalid token. Log in again to get a new one";
    } else {
      message = err.message;
    }
    res.status(401).json({ ok: false, status: "fail", message: message });
  }
};
