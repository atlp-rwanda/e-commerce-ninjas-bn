import Joi from "joi";

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
