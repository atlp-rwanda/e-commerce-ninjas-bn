/* eslint-disable @typescript-eslint/no-explicit-any */
import Shops from "../../../databases/models/shops";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";
import Order from "../../../databases/models/orders";
import CartProduct from "../../../databases/models/cartProducts";


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
const getAllProducts = async (shopId: string) => {
    return await Products.findAll({
        where: { shopId }
    });
};

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


const getOrdersPerTimeframe = async (shopId: string, startDate: Date, endDate: Date) => {
    return await Order.findAll({ where: { orderDate: { [Op.gte]: startDate, [Op.lte]: endDate }, shopId }});
};

const getOrderProductsByCartId = async(cartId: string) => {
    return await CartProduct.findAll({where: {cartId}});
}

const findProductById = async (id: string) => {
    return await Products.findOne({where: {id}});
}

const findShopByUserId = async(userId: string) => {
    return await Shops.findOne({ where: { userId }})
}

const updateProductByAttributes = async (updatedKey:string, updatedValue:any, whereKey:string, whereValue:any) =>{
    await Products.update({ [updatedKey]: updatedValue }, { where: { [whereKey]: whereValue} });
    return await findShopByAttributes(Products ,whereKey, whereValue);
 }

const markProducts = async (shopId: string) => {
    const now = new Date();
    await Products.update(
        { expired: true },
        { where: { shopId, expiryDate: { [Op.lt]: now }, expired: false } }
    );
    await Products.update(
        { status: "unavailable" },
        { where: { shopId, quantity: { [Op.lte]: 1 } } }
    );
};

const sellerGetProducts = async (shopId: string) => {
    return await Products.findAll({ where:{ shopId } });
};

export default { 
    createProduct, 
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
    sellerGetProducts
, getAllProducts, getAvailableProducts, getAvailableProductsByAttributes, getProductsByAttributes };