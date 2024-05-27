import Joi from "joi";

export const statusSchema = Joi.object({
  status: Joi.string().valid("enabled", "disabled").required().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'enabled' or 'disabled'",
    "any.required": "Status is required"
  })
});
