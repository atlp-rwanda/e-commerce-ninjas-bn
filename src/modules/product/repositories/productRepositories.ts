/* eslint-disable @typescript-eslint/no-explicit-any */
import Shops from "../../../databases/models/shops";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";
import Order from "../../../databases/models/orders";
import Shop from "../../../databases/models/shops";
import CartProduct from "../../../databases/models/cartProducts";

const createProduct = async(body:any) => {
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


const getOrdersPerTimeframe = async (shopId: number, startDate: Date, endDate: Date) => {
    return await Order.findAll({ where: { orderDate: { [Op.gte]: startDate, [Op.lte]: endDate }, shopId }});
};

const getOrderProductsByCartId = (cartId: number) => {
    return CartProduct.findAll({where: {cartId}});
}

const findProductById = (id: number) => {
    return Products.findOne({where: {id}});
}

const findShopByUserId = async(userId: number) => {
    return await Shop.findOne({ where: { userId }})
}

export default { createProduct, createShop, findShopByAttributes, findByModelsAndAttributes, deleteProductById, getOrdersPerTimeframe, getOrderProductsByCartId, findProductById, findShopByUserId , getAllProducts, getAvailableProducts, getAvailableProductsByAttributes, getProductsByAttributes };