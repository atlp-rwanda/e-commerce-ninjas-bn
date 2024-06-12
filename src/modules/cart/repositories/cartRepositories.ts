import db from "../../../databases/models"

const getCartByUserId = async (userId: string) => {
  return await db.Carts.findOne({ where: { userId, status: "pending" } })
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

export default {
  getCartByUserId,
  getCartProductsByCartId
};
