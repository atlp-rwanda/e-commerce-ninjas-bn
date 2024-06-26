"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const models_1 = __importDefault(require("../../../databases/models"));
const getCartsByUserId = async (userId) => {
    return await models_1.default.Carts.findAll({ where: { userId, status: "pending" } });
};
const addCart = async (body) => {
    return await models_1.default.Carts.create(body);
};
const addCartProduct = async (body) => {
    return await models_1.default.CartProducts.create(body);
};
const updateCartProduct = async (id, body) => {
    return await models_1.default.CartProducts.update(body, { where: { id } });
};
const getCartByUserIdAndCartId = async (userId, cartId, status = "pending") => {
    return await models_1.default.Carts.findOne({
        where: { id: cartId, userId, status },
        include: [
            {
                model: models_1.default.CartProducts,
                as: "cartProducts",
                include: [
                    {
                        model: models_1.default.Products,
                        as: "products"
                    },
                ],
            }
        ]
    });
};
const getCartProductsByCartId = async (cartId) => {
    return await models_1.default.CartProducts.findAll({
        where: { cartId },
        include: [
            {
                model: models_1.default.Products,
                as: "products",
                attributes: ["id", "name", "price", "images", "shopId"],
            },
        ],
    });
};
const getShopIdByProductId = async (id) => {
    return (await models_1.default.Products.findOne({ where: { id } })).shopId;
};
const getProductByCartIdAndProductId = async (cartId, productId) => {
    return await models_1.default.CartProducts.findOne({ where: { cartId, productId } });
};
const deleteAllCartProducts = async (cartId) => {
    await models_1.default.CartProducts.destroy({ where: { cartId } });
};
const deleteCartProduct = async (cartId, productId) => {
    await models_1.default.CartProducts.destroy({ where: { cartId, productId } });
};
const deleteAllUserCarts = async (userId) => {
    await models_1.default.Carts.destroy({ where: { userId } });
};
const deleteCartById = async (id) => {
    await models_1.default.Carts.destroy({ where: { id } });
};
const findCartByAttributes = async (key1, value1, key2, value2) => {
    return await models_1.default.Carts.findOne({ where: { [key1]: value1, [key2]: value2 } });
};
exports.default = {
    getCartsByUserId,
    getCartProductsByCartId,
    getCartByUserIdAndCartId,
    getProductByCartIdAndProductId,
    addCart,
    updateCartProduct,
    getShopIdByProductId,
    addCartProduct,
    deleteAllUserCarts,
    deleteCartById,
    deleteCartProduct,
    deleteAllCartProducts,
    findCartByAttributes
};
//# sourceMappingURL=cartRepositories.js.map