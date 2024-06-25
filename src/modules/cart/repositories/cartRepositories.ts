/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import db from "../../../databases/models";
import CartProduct from "../../../databases/models/cartProducts";
import Products from "../../../databases/models/products";
const getCartsByUserId = async (userId: string) => {
  return await db.Carts.findAll({ where: { userId, status: "pending" } });
};

const addCart = async (body: Record<string, string | number>) => {
  return await db.Carts.create(body);
};

const addCartProduct = async (body: Record<string, string | number>) => {
  return await db.CartProducts.create(body);
};

const updateCartProduct = async (
  id: string,
  body: Record<string, string | number>
) => {
  return await db.CartProducts.update(body, { where: { id } });
};

const getCartProductsByCartId = async (cartId: string) => {
  return await db.CartProducts.findAll({
    where: { cartId },
    include: [
      {
        model: db.Products,
        as: "products",
        attributes: ["id", "name", "price", "discount", "images", "shopId"],
      },
    ],
  });
};

const getShopIdByProductId = async (id: string): Promise<string> => {
  return (await db.Products.findOne({ where: { id } })).shopId;
};

const getProductByCartIdAndProductId = async (
  cartId: string,
  productId: string
) => {
  return await db.CartProducts.findOne({ where: { cartId, productId } });
};

const deleteAllCartProducts = async (cartId: string) => {
  await db.CartProducts.destroy({ where: { cartId } });
};

const deleteCartProduct = async (cartId: string, productId: string) => {
  await db.CartProducts.destroy({ where: { cartId, productId } });
};

const deleteAllUserCarts = async (userId: string) => {
  await db.Carts.destroy({ where: { userId } });
};

const deleteCartById = async (id: string) => {
  await db.Carts.destroy({ where: { id } });
};
const findCartByAttributes = async(key1: string, value1:any, key2: string, value2:any): Promise<any> => {
  return await db.Carts.findOne({ where: { [key1]: value1, [key2]: value2 } })
}
const findCartProductsByCartId = async (value: any) => {
  const result = await CartProduct.findAll({
    where: {"cartId":value },
    include: [{
      model: Products, 
      as: "products",
      attributes: [ "id" , "name", "discount", "description" , "category" , "images" ]
    }],
    attributes: [ "id" , "quantity" , "discount", "price" , "totalPrice" ]
  }) 
  return result;
};



const getCartByUserIdAndCartId = async (userId: string,cartId: string,status: string = "pending") => {
  return await db.Carts.findOne({
    where: { id: cartId, userId, status },
    include: [
      {
        model: db.CartProducts,
        as: "cartProducts",
        include: [
          {
            model: db.Products,
            as: "products"
          },
        ],
      }
    ]
  });
};


export default {
  getCartsByUserId,
  getCartProductsByCartId,
  getProductByCartIdAndProductId,
  addCart,
  updateCartProduct,
  getShopIdByProductId,
  addCartProduct,
  deleteAllUserCarts,
  deleteCartById,
  deleteCartProduct,
  deleteAllCartProducts,
  findCartByAttributes,
  findCartProductsByCartId,
  getCartByUserIdAndCartId
};