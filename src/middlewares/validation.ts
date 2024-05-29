/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import { UsersAttributes } from "../databases/models/users";
import Joi from "joi";
import httpStatus from "http-status";
import { decodeToken } from "../helpers";

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
        const userExists: UsersAttributes = await authRepositories.findUserByAttributes("email", req.body.email);
        if (userExists && userExists.isVerified === true) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Account already exists." });
        }
        if (userExists && userExists.isVerified === false) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Account already exists. Please verify your account" });
        }
        return next();
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
    }

}

const isAccountVerified = async (req: any, res: Response, next: NextFunction) => {
    try {
        let user: any = null;
        if (req?.params?.token) {
            const decodedToken = await decodeToken(req.params.token);
            user = await authRepositories.findUserByAttributes("id", decodedToken.id);
        }
        if (req?.body?.email) {
            user = await authRepositories.findUserByAttributes("email", req.body.email);
        }

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Account not found." });
        }

        if (user.isVerified) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Account already verified." });
        }

        const session = await authRepositories.findSessionByUserId(user.id);
        if (!session) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid token." });
        }

        req.session = session;
        req.user = user;
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
}




// Define the Joi schema for updating user role
const updateUserRoleSchema = Joi.object({
    role: Joi.string().valid("Admin", "Buyer", "Seller").required().messages({
        "any.required": "The 'role' parameter is required.",
        "string.base": "The 'role' parameter must be a string.",
        "any.only": "The 'role' parameter must be one of ['Admin', 'Buyer', 'Seller']."
    })
});


// Middleware function for validating request body
const validateUpdateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
//    const role = req.body.role;
    const { error } = updateUserRoleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    const user = await authRepositories.findUserByAttributes("id",id)
    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "User doesn't exist." });
    }
    next();
};


export { validation, isUserExist, isAccountVerified, validateUpdateUserRole };