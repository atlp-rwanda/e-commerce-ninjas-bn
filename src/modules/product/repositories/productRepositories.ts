/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from "../../../databases/models/collection";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";

const createProduct = async(body:any) => {
    return await Products.create(body);
}

const createCollection = async(body:any) => {
    return await Collection.create(body);
}

const getAllProducts = async() => {
    return await Products.findAll();
}

const findItemByAttributes = async(model:any,key:string,value:any) => {
    return await model.findOne({ where: { [key]: value } });
}

const findByModelAndAttributes = async (model: any, keyOne: string, keyTwo: string, valueOne: any, valueTwo: any) => {
    return await model.findOne({
        where: {
            [keyOne]: {
                [Op.iLike]: valueOne
            },
            [keyTwo]: valueTwo
        }
    });
}

export default { createProduct, createCollection, getAllProducts, findItemByAttributes,findByModelAndAttributes};