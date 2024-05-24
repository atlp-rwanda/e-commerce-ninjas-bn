import Joi from "joi";

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export { login };