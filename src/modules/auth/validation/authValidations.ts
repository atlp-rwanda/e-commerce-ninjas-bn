
import Joi from "joi";

interface User {
    email: string;
    password: string;
}

const credentialSchema = Joi.object<User>({
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
    })
});

const emailSchema = Joi.object<User>({
    email: Joi.string().email().required().messages({
        "string.base": "email should be a type of text",
        "string.email": "email must be a valid email",
        "string.empty": "email cannot be an empty field",
        "any.required": "email is required"
    })

});

const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain letters, numbers, and special characters",
        "any.required": "password is required"
    })
});


export { credentialSchema, emailSchema, resetPasswordSchema };