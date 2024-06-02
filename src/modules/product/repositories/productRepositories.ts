/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from "../../../databases/models/collection";
import Products from "../../../databases/models/products";
import { Op } from "sequelize";

const createProduct = async (body: any) => {
  return await Products.create(body);
};

const updateProductByAttributes = async (
  updatedKey: string,
  updatedValue: any,
  whereKey: string,
  whereValue: any
) => {
  return await Products.update(
    { [updatedKey]: updatedValue },
    { where: { [whereKey]: whereValue } }
  );
};

const updateProduct = async (productData: any, id: string) => {
  return await Products.update(
    { ...productData },
    { where: { id }, returning: true }
  );
};

const createCollection = async (body: any) => {
  return await Collection.create(body);
};

const getAllProducts = async () => {
  return await Products.findAll();
};

const findItemByAttributes = async (model: any, key: string, value: any) => {
  return await model.findOne({ where: { [key]: value } });
};

const findByModelAndAttributes = async (
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

const findProductByIdAndSeller = async (
  productId: number,
  sellerId: number
) => {
  return Products.findOne({ where: { id: productId, sellerId } });
};

export default {
  createProduct,
  createCollection,
  getAllProducts,
  updateProduct,
  updateProductByAttributes,
  findItemByAttributes,
  findByModelAndAttributes,
  findProductByIdAndSeller,
};
