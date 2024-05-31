/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
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

        const session = await authRepositories.findSessionByAttributes("userId",user.id);
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

const verifyUserCredentials = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: UsersAttributes = await authRepositories.findUserByAttributes(
      "email",
      req.body.email
    );
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }

    const passwordMatches = await comparePassword(
      req.body.password,
      user.password
    );
    if (!passwordMatches) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }

    req.user = user;

    const device = req.headers["user-agent"];
    if (!device) {
      return next();
    }

    const existingToken = await authRepositories.findTokenByDeviceIdAndUserId(
      device,
      user.id
    );
    if (existingToken) {
      return res
        .status(httpStatus.OK)
        .json({
          message: "Logged in successfully",
          data: { token: existingToken },
        });
    } else {
      return next();
    }
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server error", data: error.message });
  }
};






export { validation, isUserExist, isAccountVerified,verifyUserCredentials };