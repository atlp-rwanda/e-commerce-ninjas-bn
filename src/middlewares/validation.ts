/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import userRepositories from "../modules/user/repository/userRepositories";
import { UsersAttributes } from "../databases/models/users";
import Joi from "joi";
import httpStatus from "http-status";
import { comparePassword, decodeToken } from "../helpers";
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
        let userExists: UsersAttributes | null = null;

        if (req.body.email) {
            userExists = await authRepositories.findUserByAttributes("email", req.body.email);
            if (userExists) {
                if (userExists.isVerified) {
                    return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Account already exists." });
                }
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Account already exists. Please verify your account" });
            }
        }

        if (req.params.id) {
            userExists = await authRepositories.findUserByAttributes("id", req.params.id);
            if (userExists) {
                return next();
            }
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "User not found" });
        }

        return next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

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
  role: Joi.string().valid("Admin", "Customer", "Seller").required().messages({
    "any.required": "The 'role' parameter is required.",
    "string.base": "The 'role' parameter must be a string.",
    "any.only": "The 'role' parameter must be one of ['Admin', 'Customer', 'Seller']."
  })
});


// Middleware function for validating request body
const validateUpdateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  // const { role } = req.body
  const { id } = req.params
  const { error } = updateUserRoleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  //   Check if the User to change exists
  const user = await userRepositories.getSingleUserFx(Number(id));
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User does't exist." });
  }

  next();
};


export { validation, isUserExist, isAccountVerified,validateUpdateUserRole };