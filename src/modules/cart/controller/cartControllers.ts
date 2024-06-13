/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import { ExtendRequest, IExtendedCartProduct } from "../../../types";

const buyerGetCart = async (req: ExtendRequest, res: Response) => {
  try {
    const cart = await cartRepositories.getCartByUserId(req.user.id);
    const cartProducts = await cartRepositories.getCartProductsByCartId(cart.id);

    let cartTotal = 0;

    const productsDetails = cartProducts.map(cartProduct => {
      const product = (cartProduct as IExtendedCartProduct).products;
      const totalPrice = cartProduct.quantity * product.price;
      cartTotal += totalPrice;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: cartProduct.quantity,
        totalPrice: totalPrice,
      };
    });

    return res.status(httpStatus.OK).json({
      message: "Cart retrieved successfully.",
      data: {
        cartId: cart.id,
        products: productsDetails,
        total: cartTotal,
      },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};


export default {
  buyerGetCart
};
