/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Users from "../databases/models/users";

interface UserInterface {
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  profilePicture: string;
  gender: string;
  birthDate: string;
  language: string;
  currency: string;
  role: string;
}

interface ExtendedRequest extends Request {
  user: UserInterface;
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

    //? 2. Validate the token to see if it is correct or if it has not expired
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //? 3. Check if the user still exists
    const curUser = await Users.findByPk((decoded as any).id);
    if (!curUser) {
      throw new Error("User belonging to this token does not exist");
    }

    //? Grant access to the protected route
    req.user = curUser;
    next();
  } catch (err: any) {
    let message: string;
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      message = "Invalid JWT token. Log in again to get a new one";
    } else message = err.message;
    res.status(401).json({ ok: false, status: "fail", message: message });
  }
};
