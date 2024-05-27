import Joi from "joi";


export const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    })
});

export const tokenSchema = Joi.object({
    token: Joi.string().required().messages({
        "any.required": "Token is required",
        "string.empty": "Token cannot be an empty field",
        "string.base": "Token should be a type of text"
    })
});


export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        "any.required": "Token is required"
    }),
    newPassword: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password should have a minimum length of 8",
        "string.pattern.base": "Password must contain both letters and numbers",
        "any.required": "Password is required"
    }),
    confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
        "any.only": "Confirm password must match new password",
        "any.required": "Confirm password is required"
    })
});


export const updatePasswordSchema = Joi.object({
    userId: Joi.number().required().messages({
        "number.base": "User ID should be a number",
        "any.required": "User ID is required"
    }),
    oldPassword: Joi.string().required().messages({
        "string.base": "Old password should be a type of text",
        "string.empty": "Old password cannot be an empty field",
        "any.required": "Old password is required"
    }),
    newPassword: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        "string.base": "New password should be a type of text",
        "string.empty": "New password cannot be an empty field",
        "string.min": "New password should have a minimum length of 8",
        "string.pattern.base": "New password must contain both letters and numbers",
        "any.required": "New password is required"
    }),
    confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
        "any.only": "Confirm password must match new password",
        "any.required": "Confirm password is required"
    })
}).custom((value, helpers) => {
    if (value.oldPassword === value.newPassword) {
        return helpers.message({ custom: "Old password should not be similar to the new password" });
    }
    return value;
});

