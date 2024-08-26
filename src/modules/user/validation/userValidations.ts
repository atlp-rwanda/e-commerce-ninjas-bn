import Joi from "joi";
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  profilePicture?: string;
  gender: "male" | "female" | "other";
  birthDate: string;
  language: string;
  currency: string;
  role: "buyer" | "seller" | "admin";
}

export const statusSchema = Joi.object({
  status: Joi.string().valid("enabled", "disabled").required().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'enabled' or 'disabled'",
    "any.required": "Status is required"
  })
});

export const roleSchema = Joi.object({
  role: Joi.string().valid("admin", "buyer", "seller").required().messages({
    "any.required": "The 'role' parameter is required.",
    "string.base": "The 'role' parameter must be a string.",
    "any.only": "Only admin, buyer and seller are allowed."
  })
});
export const termsSchema = Joi.object({
  content: Joi.string().optional().messages({
    "string.base": "the content should be a string",
    "string.empty": "the content should not be empty"
  }),
  type: Joi.string().valid("seller", "buyer").required().messages({
    "any.required": "The 'type' parameter is required.",
    "string.base": "The 'type' parameter must be a string.",
    "any.only": "Only buyer and seller are allowed.",
    "string.empty": "The 'type' parameter cannot be empty"
  }),
  pdf: Joi.string().uri().optional().messages({
    "string.base": "pdf should be a type of text",
    "string.uri": "pdf must be a valid URI"
  })

})
export const userSchema = Joi.object<User>({
  firstName: Joi.string().messages({
    "string.base": "firstName should be a type of text",
    "string.empty": "firstName cannot be an empty field",
    "any.required": "firstName is required"
  }),
  lastName: Joi.string().messages({
    "string.base": "lastName should be a type of text",
    "string.empty": "lastName cannot be an empty field",
    "any.required": "lastName is required"
  }),
  phone: Joi.number().messages({
    "number.base": "phone number should be a type of number",
    "any.required": "phone number is required"
  }),
  profilePicture: Joi.string().uri().optional().messages({
    "string.base": "profilePicture should be a type of text",
    "string.uri": "profilePicture must be a valid URI"
  }),
  gender: Joi.string().valid("male", "female", "other").messages({
    "string.base": "gender should be a type of text",
    "any.only": "gender must be one of [male, female, other]",
    "any.required": "gender is required"
  }),
  birthDate: Joi.date().iso().messages({
    "date.base": "birthDate should be a valid date",
    "date.iso": "birthDate must be in ISO format",
    "any.required": "birthDate is required"
  }),
  language: Joi.string().messages({
    "string.base": "language should be a type of text",
    "string.empty": "language cannot be an empty field",
    "any.required": "language is required"
  }),
  currency: Joi.string().messages({
    "string.base": "currency should be a type of text",
    "string.empty": "currency cannot be an empty field",
    "any.required": "currency is required"
  }),
  role: Joi.string().valid("buyer", "seller", "admin").messages({
    "string.base": "role should be a type of text",
    "any.only": "role must be one of [buyer, seller, admin]",
    "any.required": "role is required"
  })
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
    "string.base": "Old password should be a type of text",
    "string.empty": "Old password cannot be an empty field",
    "string.pattern.base": "Old password must contain both letters, special character and numbers",
    "any.required": "Old password is required"
  }),
  newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
    "string.base": "New password should be a type of text",
    "string.empty": "New password cannot be an empty field",
    "string.min": "New password should have a minimum length of 8",
    "string.pattern.base": "New password must contain both letters and numbers",
    "any.required": "New password is required"
  }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password must match new password",
    "any.required": "Confirm password is required"
  })
});

export const changeAddressSchema = Joi.object({
  province: Joi.string().required(),
  district: Joi.string().required(),
  sector: Joi.string().required(),
  street: Joi.string().required()
});

export const passwordExpirationTimeSchema = Joi.object({
  minutes: Joi.number().integer().min(1).required().messages({
    "number.base": "Minutes should be a number.",
    "number.integer": "Minutes should be an integer.",
    "number.min": "Minutes should be at least 1.",
    "any.required": "Minutes is required."
  })
});