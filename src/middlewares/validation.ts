/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import Joi from "joi";
import httpStatus from "http-status";

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

const isEmailExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authRepositories.findUserByAttributes("email", req.body.email);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Email not found." });
        }
        if (!user.isVerified) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Email is not verified." });
        }
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

export { validation,  isEmailExist }