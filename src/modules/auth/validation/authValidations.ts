import Joi from "joi";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    profilePicture?: string;
    gender: "male" | "female" | "other";
    birthDate: string;
    language: string;
    currency: string;
    role: "buyer" | "seller" | "admin";
}

const authSchema = Joi.object<User>({
    firstName: Joi.string().required().messages({
        "string.base": "firstName should be a type of text",
        "string.empty": "firstName cannot be an empty field",
        "any.required": "firstName is required"
    }),
    lastName: Joi.string().required().messages({
        "string.base": "lastName should be a type of text",
        "string.empty": "lastName cannot be an empty field",
        "any.required": "lastName is required"
    }),
    email: Joi.string().email().required().messages({
        "string.base": "email should be a type of text",
        "string.email": "email must be a valid email",
        "string.empty": "email cannot be an empty field",
        "any.required": "email is required"
    }),
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain letters, numbers, and special characters",
        "any.required": "password is required"
    }),
    phone: Joi.number().required().messages({
        "number.base": "phone number should be a type of number",
        "any.required": "phone number is required"
    }),
    // profilePicture: Joi.string().uri().optional().messages({
    //     "string.base": "profilePicture should be a type of text",
    //     "string.uri": "profilePicture must be a valid URI"
    // }),
    gender: Joi.string().valid("male", "female", "other").required().messages({
        "string.base": "gender should be a type of text",
        "any.only": "gender must be one of [male, female, other]",
        "any.required": "gender is required"
    }),
    birthDate: Joi.date().iso().required().messages({
        "date.base": "birthDate should be a valid date",
        "date.iso": "birthDate must be in ISO format",
        "any.required": "birthDate is required"
    }),
    language: Joi.string().required().messages({
        "string.base": "language should be a type of text",
        "string.empty": "language cannot be an empty field",
        "any.required": "language is required"
    }),
    currency: Joi.string().required().messages({
        "string.base": "currency should be a type of text",
        "string.empty": "currency cannot be an empty field",
        "any.required": "currency is required"
    }),
    role: Joi.string().valid("buyer", "seller", "admin").required().messages({
        "string.base": "role should be a type of text",
        "any.only": "role must be one of [buyer, seller, admin]",
        "any.required": "role is required"
    })
});

export {authSchema};