/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import { UsersAttributes } from "../databases/models/users";
import Joi from "joi";
import httpStatus from "http-status";
import { IRequest } from "../types";

const validation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new Error(error.details.map((detail) => detail.message.replace(/"/g, "")).join(", "));
        }

        return next();
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: error.message });
    }
};


const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email
        const userExists: UsersAttributes = await authRepositories.findUserByEmail(email);
        if (userExists) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "User already exists." });
        }
        return next();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
    }

}

const checkLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email
        const user: UsersAttributes = await authRepositories.findUserByEmail(email);
        if (user) {
            const passwordMatches = (req.body.password === user.password)
            if (!passwordMatches) return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Email or Password", data: null });
            (req as IRequest).loginUserId = user.id;
            return next();
        }
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Email or Password", data: null });
    } catch (error) {
        // res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error", data: error.message })
    }

}

export { validation, isUserExist, checkLoginUser };