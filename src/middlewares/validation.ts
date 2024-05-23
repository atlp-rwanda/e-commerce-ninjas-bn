/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import userRepositories from "../modules/user/repository/userRepositories";
import Joi from "joi";
import httpStatus from "http-status";

const validation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ""));
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: errorMessages });
    }
    return next()
};

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const userExists = await userRepositories.findUserByEmail(email);
    if (userExists) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "User already exists." });
    }
    return next();
}

export {validation,isUserExist};