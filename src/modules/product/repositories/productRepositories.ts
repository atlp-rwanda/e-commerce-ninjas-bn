/* eslint-disable @typescript-eslint/no-explicit-any */
import Shops from "../../../databases/models/shops";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";

const currentDate = new Date();

const createProduct = async (body: any) => {
    return await Products.create(body);
}

const createShop = async (body: any) => {
    return await Shops.create(body);
}

const findShopByAttributes = async (model: any, key: string, value: any) => {
    return await model.findOne({ where: { [key]: value } });
}

const findByModelsAndAttributes = async (model: any, keyOne: string, keyTwo: string, valueOne: any, valueTwo: any) => {
    return await model.findOne({
        where: {
            [keyOne]: {
                [Op.iLike]: valueOne
            },
            [keyTwo]: valueTwo
        }
    });
}

const getProductsByAttributes = async (key: string, value: any) => {
    return await Products.findAll({
        where: { [key]: value }
    });
}
const getAvailableProductsByAttributes = async (key, value) => {
    return await Products.findAll({
        where: {
            [key]: value,
            isAvailable: "available",
            expiryDate: {
                [Op.gte]: currentDate
            }
        }
    })
}
const getAvailableProducts = async () => {
    return await Products.findAll({
        where: {
            isAvailable: "available",
            expiryDate: {
                [Op.gte]: currentDate
            }
        }
    });
};


const deleteProductById = async (productId: string): Promise<void> => 
{ 
    await Products.destroy({ where: { id: productId } }); 
};

export default { createProduct, createShop, findShopByAttributes, findByModelsAndAttributes, deleteProductById, getAvailableProducts, getAvailableProductsByAttributes, getProductsByAttributes };