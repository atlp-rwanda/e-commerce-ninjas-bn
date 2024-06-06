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
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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

const otpSchema = Joi.object({
  otp: Joi.number().integer().required().messages({
    "number.base": "OTP must be a 6-digit number",
    "number.empty": "OTP cannot be an empty field",
    "any.required": "OTP is required"
  })
});

const is2FAenabledSchema = Joi.object({
  is2FAEnabled: Joi.boolean().required().messages({
    "boolean.base": "2FAenabled must be a boolean",
    "boolean.empty": "2FAenabled cannot be an empty field",
    "any.required": "2FAenabled is required"
  })
});

export { credentialSchema, emailSchema, otpSchema, is2FAenabledSchema };
