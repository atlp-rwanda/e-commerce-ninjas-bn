"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
const sequelize_1 = require("sequelize");
const models_1 = __importDefault(require("../../../databases/models"));
const products_1 = __importDefault(require("../../../databases/models/products"));
const createProduct = async (body) => {
    return await models_1.default.Products.create(body);
};
const createShop = async (body) => {
    return await models_1.default.Shops.create(body);
};
const findShopByAttributes = async (model, key, value) => {
    return await model.findOne({ where: { [key]: value } });
};
const findByModelsAndAttributes = async (model, keyOne, keyTwo, valueOne, valueTwo) => {
    return await model.findOne({
        where: {
            [keyOne]: {
                [sequelize_1.Op.iLike]: valueOne,
            },
            [keyTwo]: valueTwo,
        },
    });
};
const deleteProductById = async (productId) => {
    await models_1.default.Products.destroy({ where: { id: productId } });
};
const getOrdersPerTimeframe = async (shopId, startDate, endDate) => {
    return await models_1.default.Orders.findAll({
        where: { orderDate: { [sequelize_1.Op.gte]: startDate, [sequelize_1.Op.lte]: endDate }, shopId },
    });
};
const getOrderProductsByCartId = async (cartId) => {
    return await models_1.default.CartProducts.findAll({ where: { cartId } });
};
const findProductById = async (id) => {
    return await models_1.default.Products.findOne({ where: { id } });
};
const findShopByUserId = async (userId) => {
    return await models_1.default.Shops.findOne({ where: { userId } });
};
const updateProductByAttributes = async (updatedKey, updatedValue, whereKey, whereValue) => {
    await models_1.default.Products.update({ [updatedKey]: updatedValue }, { where: { [whereKey]: whereValue } });
    return await findShopByAttributes(models_1.default.Products, whereKey, whereValue);
};
const markProducts = async (shopId) => {
    const now = new Date();
    await models_1.default.Products.update({ expired: true }, { where: { shopId, expiryDate: { [sequelize_1.Op.lt]: now }, expired: false } });
    await models_1.default.Products.update({ status: "unavailable" }, { where: { shopId, quantity: { [sequelize_1.Op.lte]: 1 } } });
};
const sellerGetProducts = async (shopId, limit, offset) => {
    const { rows, count } = await models_1.default.Products.findAndCountAll({
        where: { shopId },
        limit,
        offset,
    });
    return { rows, count };
};
const getProductByIdAndShopId = async (id, shopId) => {
    return await products_1.default.findOne({ where: { id, shopId } });
};
const updateProduct = async (model, productData, key, value) => {
    return await model.update({ ...productData }, { where: { [key]: value }, returning: true });
};
const currentDate = new Date();
const userGetProducts = async (limit, offset) => {
    const { rows, count } = await models_1.default.Products.findAndCountAll({
        where: {
            status: "available",
            expiryDate: {
                [sequelize_1.Op.gte]: currentDate,
            },
        },
        limit: limit,
        offset: offset,
    });
    return { rows, count };
};
const userSearchProducts = async (searchQuery, limit, offset) => {
    return await models_1.default.Products.findAndCountAll({
        ...searchQuery,
        limit,
        offset,
    });
};
const sellerGetProductById = async (shopId, productId) => {
    return await models_1.default.Products.findAll({
        where: { shopId, id: productId },
    });
};
const findProductfromWishList = async (productId, userId) => {
    return await models_1.default.wishLists.findOne({
        where: { productId, userId },
        include: [
            {
                model: models_1.default.Products,
                as: "products",
                attributes: ["id", "name", "price", "images", "shopId"],
            },
        ],
    });
};
const addProductToWishList = async (body) => {
    return await models_1.default.wishLists.create(body);
};
const findProductFromWishListByUserId = async (userId) => {
    return await models_1.default.wishLists.findAll({
        where: { userId },
        include: [
            {
                model: models_1.default.Products,
                as: "products",
                attributes: ["id", "name", "price", "images", "shopId"],
            },
        ],
    });
};
const deleteAllWishListByUserId = async (userId) => {
    return await models_1.default.wishLists.destroy({ where: { userId: userId } });
};
const deleteProductFromWishListById = async (productId, userId) => {
    return await models_1.default.wishLists.destroy({ where: { productId, userId } });
};
exports.default = {
    createProduct,
    updateProduct,
    createShop,
    findShopByAttributes,
    findByModelsAndAttributes,
    deleteProductById,
    getOrdersPerTimeframe,
    getOrderProductsByCartId,
    findProductById,
    findShopByUserId,
    updateProductByAttributes,
    markProducts,
    sellerGetProducts,
    userGetProducts,
    userSearchProducts,
    sellerGetProductById,
    findProductfromWishList,
    addProductToWishList,
    findProductFromWishListByUserId,
    deleteAllWishListByUserId,
    getProductByIdAndShopId,
    deleteProductFromWishListById,
};
//# sourceMappingURL=productRepositories.js.map