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

export const authSchema = Joi.object<User>({
    firstName: Joi.string().required().messages({
        "string.base": "First name should be a type of text",
        "string.empty": "First name cannot be an empty field",
        "any.required": "First name is required"
    }),
    lastName: Joi.string().required().messages({
        "string.base": "Last name should be a type of text",
        "string.empty": "Last name cannot be an empty field",
        "any.required": "Last name is required"
    }),
    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    }),
    password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password should have a minimum length of 8",
        "string.pattern.base": "Password must contain both letters and numbers",
        "any.required": "Password is required"
    }),
    phone: Joi.number().required().messages({
        "number.base": "Phone number should be a type of number",
        "any.required": "Phone number is required"
    }),
    profilePicture: Joi.string().uri().optional().messages({
        "string.base": "Profile picture should be a type of text",
        "string.uri": "Profile picture must be a valid URI"
    }),
    gender: Joi.string().valid("male", "female", "other").required().messages({
        "string.base": "Gender should be a type of text",
        "any.only": "Gender must be one of [male, female, other]",
        "any.required": "Gender is required"
    }),
    birthDate: Joi.date().iso().required().messages({
        "date.base": "Birth date should be a valid date",
        "date.iso": "Birth date must be in ISO format",
        "any.required": "Birth date is required"
    }),
    language: Joi.string().required().messages({
        "string.base": "Language should be a type of text",
        "string.empty": "Language cannot be an empty field",
        "any.required": "Language is required"
    }),
    currency: Joi.string().required().messages({
        "string.base": "Currency should be a type of text",
        "string.empty": "Currency cannot be an empty field",
        "any.required": "Currency is required"
    }),
    role: Joi.string().valid("buyer", "seller", "admin").required().messages({
        "string.base": "Role should be a type of text",
        "any.only": "Role must be one of [buyer, seller, admin]",
        "any.required": "Role is required"
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "any.required": "Password is required"
    })
});


export const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.email": "Email must be a valid email",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is required"
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

