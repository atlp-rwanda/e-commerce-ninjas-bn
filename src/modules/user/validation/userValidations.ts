import Joi from 'joi';

const emailRegex = /^[a-zA-Z][a-zA-Z0-9._]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

const login = Joi.object({
    email: Joi.string().regex(emailRegex).required().messages({
        'string.pattern.base': 'Please use your real email',
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Please provide real password',
    }),
});

export default { login };