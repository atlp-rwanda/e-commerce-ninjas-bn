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

const resetPasswordSchema = Joi.object({
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
        "string.base": "password should be a type of text",
        "string.empty": "password cannot be an empty field",
        "string.min": "password should have a minimum length of 8",
        "string.pattern.base": "password must contain at least uppercase letter,lowercase letter, number, and special character",
        "any.required": "password is required"
    })
});

const sellerRegistrationSchema = Joi.object({
  firstName: Joi.string().max(128).required().messages({
    "string.empty": "First name is required.",
    "string.max": "First name should not exceed 128 characters."
  }),
  
  lastName: Joi.string().max(128).required().messages({
    "string.empty": "Last name is required.",
    "string.max": "Last name should not exceed 128 characters."
  }),
  
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address."
  }),
  
  password: Joi.string().min(8).max(255).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password should have at least 8 characters.",
    "string.max": "Password should not exceed 255 characters."
  }),
  
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    "string.empty": "Phone number is required.",
    "string.pattern.base": "Phone number must be between 10 and 15 digits."
  }),

  businessName: Joi.string().max(128).required().messages({
    "string.empty": "Business name is required.",
    "string.max": "Business name should not exceed 128 characters."
  }),
  
  businessDescription: Joi.string().max(255).optional().messages({
    "string.max": "Business description should not exceed 255 characters."
  }),
  
  Tin: Joi.number().required().messages({
    "number.base": "TIN must be a number.",
    "any.required": "TIN is required."
  }),
  mobileNumber: Joi.string().optional().allow(null).messages({
    "string.pattern.base": "Mobile number must be a 10 or 15 digits number."
  }),

  mobilePayment: Joi.string().optional().required().messages({
    "string.empty": "Mobile payment can't be null.",
    "any.required": "Mobile payment is required."
  }),
  
  bankPayment: Joi.string().optional().required().messages({
    "string.base": "Bank payment can't be null.",
    "any.required": "Bank payment is required."
  }),
  
  bankAccount: Joi.string().max(128).optional().when("bankPayment", {
    is: true,
    then: Joi.required()
  }).messages({
    "string.empty": "Bank account is required when bank payment is selected.",
    "string.max": "Bank account should not exceed 128 characters."
  }),
  
  bankName: Joi.string().max(128).optional().when("bankPayment", {
    is: true,
    then: Joi.required()
  }).messages({
    "string.empty": "Bank name is required when bank payment is selected.",
    "string.max": "Bank name should not exceed 128 characters."
  }),
  terms: Joi.boolean().required().messages({
    "boolean.base": "Terms must be a boolean.",
    "any.required": "Terms is required."
  })
});

export { credentialSchema, emailSchema, otpSchema, is2FAenabledSchema,resetPasswordSchema,sellerRegistrationSchema };