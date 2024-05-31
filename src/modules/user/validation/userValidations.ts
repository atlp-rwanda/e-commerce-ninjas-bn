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

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.base": "Old password should be a type of text",
    "string.empty": "Old password cannot be an empty field",
    "any.required": "Old password is required"
  }),
  newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$")).required().messages({
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