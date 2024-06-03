/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import Users, { UsersAttributes } from "../databases/models/users";
import httpStatus from "http-status";
import { comparePassword, decodeToken } from "../helpers";
import productRepositories from "../modules/product/repositories/productRepositories";
import Collection from "../databases/models/collection";
import Products from "../databases/models/products";

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

const isUsersExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCount = await Users.count();
        if (userCount === 0) {
            return res.status(httpStatus.NOT_FOUND).json({ error: "No users found in the database." });
        }
        next();
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internet Server error." });
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

        const session = await authRepositories.findSessionByAttributes("userId", user.id);
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

        const device = req.headers["user-device"];
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
                    data: { token: existingToken }
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

const isProductExist = async (req: any, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.user.id;
        const collectionId = req.params.id
        const isCollection = await productRepositories.findItemByAttributes(Collection, "id", collectionId);
        if (!isCollection) {
            return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Collection not found" });
        }
        const isProductAvailable = await productRepositories.findByModelAndAttributes(Products, "name", "sellerId", req.body.name, sellerId);
        if (isProductAvailable) {
            return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Product already exists" });
        }
        next();
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
}


const isCollectionExist = async (req: any, res: Response, next: NextFunction) => {
    try {
        const isCollection = await productRepositories.findByModelAndAttributes(Collection, "name", "sellerId", req.body.name, req.user.id)
        if (!isCollection) {
            return next();
        }
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Collection already exist." });
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
    }
}

const transformFilesToBody = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) {
        return res.status(400).json({ status: 400, message: "Images are required" });
    }

    const files = req.files as Express.Multer.File[];
    req.body.images = files.map(file => file.path);
    next();
};


const productsPagination = async (req: any, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const user = req.user;

        if (!req.query.page || !req.query.limit) {
            if (user.role === "seller") {
                const data = await productRepositories.getProductsByAttributes("sellerId", req.user.id);
                return res.status(httpStatus.OK).json({ status: httpStatus.OK, data });
            }
            const data = await productRepositories.getAllProducts();
            return res.status(httpStatus.OK).json({ status: httpStatus.OK, data });
        }

        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: "Page and limit must be positive numbers" });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        let allProducts;
        if (user.role === "seller") {
            allProducts = await productRepositories.getProductsByAttributes("sellerId", user.id);
        } else if (user.role === "buyer") {
            allProducts = await productRepositories.getAllProducts();
        }

        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        let nextPage: { page: number; limit: number } | undefined;
        let previousPage: { page: number; limit: number } | undefined;

        if (endIndex < allProducts.length) {
            nextPage = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            previousPage = {
                page: page - 1,
                limit: limit
            };
        }

        req.paginationResults = { nextPage, previousPage, data: paginatedProducts };

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { validation, isUserExist, isAccountVerified, verifyUserCredentials, isUsersExist, isProductExist, isCollectionExist, transformFilesToBody, productsPagination };