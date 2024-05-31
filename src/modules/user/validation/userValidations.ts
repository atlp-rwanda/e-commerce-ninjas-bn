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
  role: Joi.string().valid("Admin", "Buyer", "Seller").required().messages({
      "any.required": "The 'role' parameter is required.",
      "string.base": "The 'role' parameter must be a string.",
      "any.only": "Only Admin, Buyer and Seller are allowed."
  })
});
const userSchema = Joi.object<User>({
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
export {userSchema};
