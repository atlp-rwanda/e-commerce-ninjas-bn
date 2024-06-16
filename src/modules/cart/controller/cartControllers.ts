/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import { ExtendRequest, IExtendedCartProduct } from "../../../types";
import { cartStatusEnum } from "../../../enums";
import productRepositories from "../../product/repositories/productRepositories";

const buyerGetCart = async (req: ExtendRequest, res: Response) => {
  try {
    const cart = await cartRepositories.getCartByUserIdAndCartId(req.user.id, req.params.cartId);
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
      message: "Cart details",
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

const buyerAddCart = async (req: ExtendRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const createdCart = await cartRepositories.addCart({
      userId: req.user.id,
      status: cartStatusEnum.PENDING
    });
    const product = await productRepositories.findProductById(productId);
    const totalPrice = product.price * quantity;
    const createdCartProduct = await cartRepositories.addCartProduct({
      cartId: createdCart.id,
      productId,
      quantity,
      price: product.price,
      discount: product.discount,
      totalPrice
    })
    return res.status(httpStatus.CREATED).json({ message: "Cart added successfully", data: createdCartProduct })
  }
  catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
}

const buyerGetCarts = async (req: ExtendRequest, res: Response) => {
  try {
    const carts = await cartRepositories.getCartsByUserId(req.user.id);

    const allCartsDetails = await Promise.all(carts.map(async (cart) => {
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

      return {
        cartId: cart.id,
        products: productsDetails,
        total: cartTotal,
      };
    }));

    return res.status(httpStatus.OK).json({
      message: "Buyer's all carts",
      data: allCartsDetails,
    });
  }
  catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
}

const buyerUpdateCart = async (req: ExtendRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const cartId = req.params.cartId;
    const cartProducts = await cartRepositories.getCartProductsByCartId(cartId);
    const existingCartProduct = cartProducts.find(cartProduct => cartProduct.productId === productId);
    if (existingCartProduct) {
      await cartRepositories.updateCartProduct(existingCartProduct.id, { quantity, totalPrice: existingCartProduct.price * quantity })
    }
    else {
      const product = await productRepositories.findProductById(productId);
      const totalPrice = product.price * quantity;
      await cartRepositories.addCartProduct({ cartId, productId, quantity, price: product.price, discount: product.discount, totalPrice })
    }
    return res.status(httpStatus.OK).json({ message: "Cart updated successfully" })
  }
  catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
}

export default {
  buyerGetCart,
  buyerAddCart,
  buyerGetCarts,
  buyerUpdateCart
};
