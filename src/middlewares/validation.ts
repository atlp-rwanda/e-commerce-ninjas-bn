import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";

const validation = (schema: Joi.ObjectSchema | Joi.ArraySchema) => async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ""));
        return res.status(httpStatus.BAD_REQUEST).json({ status: false, message: errorMessages });
    }
    return next();
};

export default validation;