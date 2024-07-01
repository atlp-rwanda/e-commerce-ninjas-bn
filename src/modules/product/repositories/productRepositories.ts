/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from "sequelize";
import db from "../../../databases/models";
import Products from "../../../databases/models/products";
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

const deleteProductById = async (productId: string) => {
  const product = await findProductById(productId);
  if (product) {
    await db.Products.destroy({ where: { id: productId } });
  }
  return product;
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

const getProductByIdAndShopId = async (id: string, shopId: string) => {
  return await Products.findOne({ where: { id, shopId } });
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

const createWishList = async (body: any)=>{
  return await db.wishLists.create(body);
} 
const addProductToWishList = async (body:any)=>{
  return await db.wishListProducts.create(body);
}
const getWishListByUserId = async (userId: string) => {
  return await db.wishLists.findOne({ where: { userId } });
};
const getProductsFromWishlist = async (wishListId:string) => {
  return await db.wishListProducts.findAll({where : { wishListId } ,
    include: [
      {
        model: db.Products,
        as: "products",
        attributes: ["id", "name", "price", "images", "shopId"]
      }
    ]
  }
  );
}
const findProductfromWishList = async (productId:string , wishListId:string) => {
  return await db.wishListProducts.findOne({ where: { productId, wishListId },
    include: [
      {
        model: db.Products,
        as: "products",
        attributes: ["id", "name", "price", "images", "shopId"]
      }
    ] });
}
const findWishListByUserId = async (userId: string) => {
  return await db.wishLists.findOne({
    where: { userId },
    include: [
      {
        model: db.wishListProducts,
        as: "wishListProducts",
        attributes: ["id", "productId", "createdAt", "updatedAt"],
        include: [
          {
            model: db.Products,
            as: "products",
            attributes: ["id", "name", "price", "images", "shopId"],
          },
        ],
      },
    ],
  });
};

const deleteAllProductFromWishListById = async (wishListId:string) => {
return await db.wishListProducts.destroy({ where: { wishListId: wishListId } });
}
const removeWishList = async(wishListId:string)=>{
await db.wishLists.destroy({ where: { id: wishListId }});
}

const deleteProductFromWishList = async (productId:string, wishListId:string) => {
  return await db.wishListProducts.destroy({ where: { productId:productId, wishListId: wishListId } });
}

const expiredProductsByUserId = async (userId: string) => {
  return await db.Products.findAll({
    include: [
        {
            model: db.Shops,
            as: "shops",
            where: { userId: userId },
        }
    ],
    where: { expiryDate: { [Op.lt]: new Date() } }
  });
};
const userCreateReview = async (body: any) => {
  return await db.ProductReviews.create(body)
}

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
  findWishListByUserId,
  deleteAllProductFromWishListById,
  deleteProductFromWishList,
  getWishListByUserId,
  createWishList,
  getProductsFromWishlist,
  getProductByIdAndShopId,
  expiredProductsByUserId,
  removeWishList,
  userCreateReview  
};
  

