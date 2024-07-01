/* eslint-disable comma-dangle */
import Joi from "joi";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const cartSchema = Joi.object({
    productId: Joi.string().pattern(uuidPattern).required().messages({
        "string.pattern.base": "productId must be a valid UUID",
        "string.empty": "productId is required"
    }),
    quantity: Joi.number().required().messages({
        "number.base": "quantity must be a number",
        "any.required": "quantity is required"
    })
});
  const updateOrderStatusSchema = Joi.object({
    status: Joi.string().required()
  });

export {
    cartSchema,
    updateOrderStatusSchema
}