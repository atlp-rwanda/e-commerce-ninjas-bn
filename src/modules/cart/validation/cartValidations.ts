/* eslint-disable */
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
const paymentCheckoutSchema = Joi.object({
    cartId: Joi.string().required()
})

const updateOrderStatusSchema = Joi.object({
    status: Joi.string().required(),
    shippingProcess: Joi.string().required()
});

const productDetailsSchema = Joi.object({
    planInfo: Joi.object().required().keys({
        name: Joi.string().required().messages({
            'any.required': 'name is required and is plan name',
            'string.base': 'name must be a string and is plan name',
            'string.empty': 'name is not allowed to be empty and is plan name',
        }),
        active: Joi.boolean().required().messages({
            'any.required': 'active is required and is plan active',
            'string.base': 'active must be a string and is plan active',
            'string.empty': 'active is not allowed to be empty and is plan active',
        }),
        url: Joi.string().required().messages({
            'any.required': 'url is required and is plan url',
            'string.base': 'url must be a string and is plan url',
            'string.empty': 'url is not allowed to be empty and is plan url',
        }),
        description: Joi.string().required().messages({
            'any.required': 'description is required and is plan description',
            'string.base': 'description must be a string and is plan description',
            'string.empty': 'description is not allowed to be empty and is plan description',
        }),
        'images[0]': Joi.string().required().messages({
            'any.required': 'images[0] is required and is plan first image',
            'string.base': 'images[0] must be a string and is plan first image',
            'string.empty': 'images[0] is not allowed to be empty and is plan first image',
        }),
        'images[1]': Joi.string().messages({
            'any.required': 'images[1] is required and is plan second image',
            'string.base': 'images[1] must be a string and is plan second image',
            'string.empty': 'images[1] is not allowed to be empty and is plan second image',
        }),
        default_price_data: Joi.object().required().keys({
            unit_amount: Joi.number().required().messages({
                'any.required': 'unit_amount is required and is unit_amount',
                'string.base': 'unit_amount must be a string and is unit_amount',
                'string.empty': 'unit_amount is not allowed to be empty and is unit_amount',
            }),
            currency: Joi.string().required().valid('usd', 'aed', 'afn', 'all', 'amd', 'ang', 'aoa', 'ars', 'aud', 'awg', 'azn', 'bam', 'bbd', 'bdt', 'bgn', 'bhd', 'bif', 'bmd', 'bnd', 'bob', 'brl', 'bsd', 'bwp', 'byn', 'bzd', 'cad', 'cdf', 'chf', 'clp', 'cny', 'cop', 'crc', 'cve', 'czk', 'djf', 'dkk', 'dop', 'dzd', 'egp', 'etb', 'eur', 'fjd', 'fkp', 'gbp', 'gel', 'gip', 'gmd', 'gnf', 'gtq', 'gyd', 'hkd', 'hnl', 'hrk', 'htg', 'huf', 'idr', 'ils', 'inr', 'isk', 'jmd', 'jod', 'jpy', 'kes', 'kgs', 'khr', 'kmf', 'krw', 'kwd', 'kyd', 'kzt', 'lak', 'lbp', 'lkr', 'lrd', 'lsl', 'mad', 'mdl', 'mga', 'mkd', 'mmk', 'mnt', 'mop', 'mur', 'mvr', 'mwk', 'mxn', 'myr', 'mzn', 'nad', 'ngn', 'nio', 'nok', 'npr', 'nzd', 'omr', 'pab', 'pen', 'pgk', 'php', 'pkr', 'pln', 'pyg', 'qar', 'ron', 'rsd', 'rub', 'rwf', 'sar', 'sbd', 'scr', 'sek', 'sgd', 'shp', 'sle', 'sos', 'srd', 'std', 'szl', 'thb', 'tjs', 'tnd', 'top', 'try', 'ttd', 'twd', 'tzs', 'uah', 'ugx', 'uyu', 'uzs', 'vnd', 'vuv', 'wst', 'xaf', 'xcd', 'xof', 'xpf', 'yer', 'zar', 'zmw', 'usdc', 'btn', 'ghs', 'eek', 'lvl', 'svc', 'vef', 'ltl', 'sll', 'mro').messages({
                'any.required': 'currency is required and is currency',
                'string.base': 'currency must be a string and is currency',
                'string.empty': 'currency is not allowed to be empty and is currency',
            }),
        })
    })
});

const checkoutSessionSchema = Joi.object({
    sessionInfo: Joi.object().required().keys({
        success_url: Joi.string().messages({
            'any.required': 'success_url is required',
            'string.base': 'success_url must be a string',
            'string.empty': 'success_url is not allowed to be empty',
        }),
        cancel_url: Joi.string().messages({
            'any.required': 'cancel_url is required',
            'string.base': 'cancel_url must be a string',
            'string.empty': 'cancel_url is not allowed to be empty',
        }),
        return_url: Joi.string().messages({
            'any.required': 'return_url is required',
            'string.base': 'return_url must be a string',
            'string.empty': 'return_url is not allowed to be empty',
        }),
        customer_email: Joi.string().required().messages({
            'any.required': 'customer_email is required and is customer email',
            'string.base': 'customer_email must be a string and is customer email',
            'string.empty': 'customer_email is not allowed to be empty and is customer email',
        }),
        mode: Joi.string().required().valid('payment', 'setup', 'subscription').messages({
            'any.required': 'mode is required',
            'string.base': 'mode must be a string',
            'string.empty': 'mode is not allowed to be empty',
        }),
        ui_mode: Joi.string().required().valid('hosted', 'embedded').messages({
            'any.required': 'ui_mode is required',
            'string.base': 'ui_mode must be a string',
            'string.empty': 'ui_mode is not allowed to be empty',
        }),
        payment_method_types: Joi.array().required().items(Joi.string().valid('card', 'link', 'cashapp')),
        line_items: Joi.array().required().items(
            Joi.object().keys({
                quantity: Joi.number().integer().default(1).required(),
                price: Joi.string().required().messages({
                    'any.required': 'price is required and is price id',
                    'string.base': 'price must be a string and is price id',
                    'string.empty': 'price is not allowed to be empty and is price id',
                }),
            })
        ),
    })
});

const updateCartStatusSchema = Joi.object({
    cartId: Joi.string().required().messages({
        'any.required': 'cartId is required',
        'string.base': 'cartId must be a string',
        'string.empty': 'cartId is not allowed to be empty',
    }),
    status: Joi.string().required().messages({
        'any.required': 'status is required',
        'string.base': 'status must be a string',
        'string.empty': 'status is not allowed to be empty',
    })
})

const orderSchema = Joi.object({
    cartId: Joi.string().guid({ version: 'uuidv4' }).required(),
    paymentMethodId: Joi.string().required(),
    products: Joi.array().required(),
    status: Joi.string().valid('pending', 'completed', 'shipped', 'cancelled').required(),
});
export {
    cartSchema,
    paymentCheckoutSchema,
    updateOrderStatusSchema,
    productDetailsSchema, checkoutSessionSchema,
    updateCartStatusSchema,
    orderSchema
}   