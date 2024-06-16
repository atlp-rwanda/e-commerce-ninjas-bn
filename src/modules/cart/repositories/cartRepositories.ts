import db from "../../../databases/models"

const getCartsByUserId = async (userId: string) => {
  return await db.Carts.findAll({ where: { userId, status: "pending" } })
}

const addCart = async (body: Record<string, string | number>) => {
  return await db.Carts.create(body)
}

const addCartProduct = async (body: Record<string, string | number>) => {
  return await db.CartProducts.create(body)
}

const updateCartProduct = async (id: string, body: Record<string, string | number>) => {
  return await db.CartProducts.update(body, { where: { id } })
}

const getCartByUserIdAndCartId = async (userId: string, cartId: string) => {
  return await db.Carts.findOne({ where: { id: cartId, userId, status: "pending" } })
}

const getCartProductsByCartId = async (cartId: string) => {
  return await db.CartProducts.findAll({
    where: { cartId },
    include: [
      {
        model: db.Products,
        as: "products",
        attributes: ["id", "name", "price", "images"]
      }
    ]
  });
}

const getShopIdByProductId = async (id: string): Promise<string> => {
  return (await db.Products.findOne({ where: { id }})).shopId;
}

export default {
  getCartsByUserId,
  getCartProductsByCartId,
  getCartByUserIdAndCartId,
  addCart, updateCartProduct,
  getShopIdByProductId,
  addCartProduct
};
