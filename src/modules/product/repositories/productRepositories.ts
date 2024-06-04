/* eslint-disable @typescript-eslint/no-explicit-any */
import Shops from "../../../databases/models/shops";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";

const createProduct = async (body: any) => {
    return await Products.create(body);
}

const createShop = async(body:any) => {
    return await Shops.create(body);
}

const findShopByAttributes = async(model:any,key:string,value:any) => {
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
// include: [{ model: Collection, required: true }],

const getProductsByAttributes = async (key: string, value: string) => {
    return await Products.findAll({
        where: {
            [key]: value
        }
    });
}

const findProductsPaginatted = async (limit, offset) => {
    return await Products.findAll({
        limit,
        offset
    });
}

export default { createProduct, createShop, findShopByAttributes, findByModelsAndAttributes, findProductsPaginatted, getProductsByAttributes };