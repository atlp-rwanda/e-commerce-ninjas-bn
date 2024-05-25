/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import httpStatus from "http-status";
import authRepositories from "../modules/auth/repository/authRepositories";
import { UsersAttributes } from "../databases/models/users";

declare module "express" {
    interface Request {
        user?: UsersAttributes;
    }
}

const validation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            throw new Error(error.details.map((detail) => detail.message.replace(/"/g, "")).join(", "));
        }

        return next();
    } catch (error: any) {
        res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: error.message });
    }
};

const isAccountExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email;
        const userExists: UsersAttributes | null = await authRepositories.findUserByEmail(email);
        if (userExists) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "User already exists." });
        }
        return next();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

const validateParams = (schema: Joi.ObjectSchema | Joi.ArraySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: 400,
                message: error.details.map(detail => detail.message).join(", ")
            });
        }
        next();
    };
};

const validateResetToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const user = await authRepositories.findUserByResetToken(token);

        if (!user || user.resetPasswordExpires! < new Date()) {
            return res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "Token is invalid or has expired" });
        }
        req.user = user;
        next();
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
    }
};

const isEmailExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email;
        const userExists = await authRepositories.findUserByEmail(email);
        if (!userExists) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "User not found" });
        }
        req.user = userExists;
        next();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
};



export { validation, isAccountExist,  validateParams, validateResetToken, isEmailExist };
