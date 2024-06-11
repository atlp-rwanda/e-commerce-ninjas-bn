/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from "sequelize";
import db from "../../../databases/models";
const createProduct = async (body: any) => {
  return await db.Products.create(body);
};

const createShop = async (body: any) => {
  return await db.Shops.create(body);
};

const findShopByAttributes = async (model: any, key: string, value: any) => {
  return await model.findOne({ where: { [key]: value } });
};

const findByModelsAndAttributes = async (
  model: any,
  keyOne: string,
  keyTwo: string,
  valueOne: any,
  valueTwo: any
) => {
  return await model.findOne({
    where: {
      [keyOne]: {
        [Op.iLike]: valueOne,
      },
      [keyTwo]: valueTwo,
    },
  });
};

const deleteProductById = async (productId: string): Promise<void> => {
  await db.Products.destroy({ where: { id: productId } });
};

const getOrdersPerTimeframe = async (
  shopId: string,
  startDate: Date,
  endDate: Date
) => {
  return await db.Orders.findAll({
    where: { orderDate: { [Op.gte]: startDate, [Op.lte]: endDate }, shopId },
  });
};

const getOrderProductsByCartId = async (cartId: string) => {
  return await db.CartProducts.findAll({ where: { cartId } });
};

const findProductById = async (id: string) => {
  return await db.Products.findOne({ where: { id } });
};

const findShopByUserId = async (userId: string) => {
  return await db.Shops.findOne({ where: { userId } });
};

const updateProductByAttributes = async (
  updatedKey: string,
  updatedValue: any,
  whereKey: string,
  whereValue: any
) => {
  await db.Products.update(
    { [updatedKey]: updatedValue },
    { where: { [whereKey]: whereValue } }
  );
  return await findShopByAttributes(db.Products, whereKey, whereValue);
};

const markProducts = async (shopId: string) => {
  const now = new Date();
  await db.Products.update(
    { expired: true },
    { where: { shopId, expiryDate: { [Op.lt]: now }, expired: false } }
  );
  await db.Products.update(
    { status: "unavailable" },
    { where: { shopId, quantity: { [Op.lte]: 1 } } }
  );
};

const sellerGetProducts = async (
  shopId: string,
  limit: number,
  offset: number
) => {
  const { rows, count } = await db.Products.findAndCountAll({
    where: { shopId },
    limit,
    offset,
  });
  return { rows, count };
};

const updateProduct = async (
  model: any,
  productData: any,
  key: string,
  value: any
) => {
  return await model.update(
    { ...productData },
    { where: { [key]: value }, returning: true }
  );
};

const currentDate = new Date();

const userGetProducts = async (limit, offset) => {
  const { rows, count } = await db.Products.findAndCountAll({
    where: {
      status: "available",
      expiryDate: {
        [Op.gte]: currentDate,
      },
    },
    limit: limit,
    offset: offset,
  });
  return { rows, count };
};
const userSearchProducts = async (searchQuery: any, limit, offset) => {
  return await db.Products.findAndCountAll({
    ...searchQuery,
    limit,
    offset,
  });
};

const sellerGetProductById = async (shopId: string, productId: string) => {
  return await db.Products.findAll({
    where: { shopId, id: productId },
  });
};

const findProductfromWishList = async (productId: string, userId: string) => {
  return await db.wishLists.findOne({ where: { productId, userId } });
};
const addProductToWishList = async (body: any) => {
  return await db.wishLists.create(body);
};

const findProductFromWishListByUserId = async (userId: string) => {
  return await db.wishLists.findAll({ where: { userId: userId } });
};

const deleteAllWishListByUserId = async (userId: string) => {
  return await db.wishLists.destroy({ where: { userId: userId } });
};

const deleteProductFromWishListById = async (
  productId: string,
  userId: string
) => {
  return await db.wishLists.destroy({ where: { productId, userId } });
};

export default {
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
  deleteProductFromWishListById,
};
