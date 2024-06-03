import Joi from "joi";

const productSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required"
    }),
    description: Joi.string().optional().messages({
        "string.base": "Description must be a string"
    }),
    price: Joi.number().precision(2).required().messages({
        "number.base": "Price must be a number",
        "number.precision": "Price can have up to 2 decimal places",
        "any.required": "Price is required"
    }),
    discount: Joi.string().optional().messages({
        "string.base": "Discount must be a string"
    }),
    category: Joi.string().required().messages({
        "string.base": "Category must be a string",
        "any.required": "Category is required"
    }),
    expiryDate: Joi.date().optional().messages({
        "date.base": "Expiry Date must be a valid date"
    }),
    expired: Joi.boolean().default(false).messages({
        "boolean.base": "Expired must be a boolean"
    }),
    bonus: Joi.string().optional().messages({
        "string.base": "Bonus must be a string"
    }),
    images: Joi.array().min(4).max(8).required().messages({
        "array.base": "Images must be an array of URIs",
        "array.min": "Images must have at least 4 items",
        "array.max": "Images can have up to 8 items",
        "any.required": "Images are required"
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 0",
        "any.required": "Quantity is required"
    })
});

const collectionSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "any.required": "Name is required"
    }),
    description: Joi.string().optional().messages({
        "string.base": "Description must be a string"
    })
})

export { productSchema, collectionSchema };