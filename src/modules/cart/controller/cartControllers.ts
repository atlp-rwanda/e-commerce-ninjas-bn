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
    const userId = req.user.id;
    const carts = await cartRepositories.getCartsByUserId(userId);

    const updateCartProduct = async (cartProduct, quantity, product) => {
      await cartRepositories.updateCartProduct(cartProduct.id, {
        quantity,
        totalPrice: product.price * quantity
      });
      res.status(httpStatus.CREATED).json({ message: "Cart quantity updated successfully" });
    };

    const addProductToExistingCart = async (cart, product, quantity) => {
      const totalPrice = product.price * quantity;
      await cartRepositories.addCartProduct({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
        discount: product.discount,
        totalPrice
      });
      res.status(httpStatus.CREATED).json({ message: "Product added to existing Cart" });
    };

    for (const cart of carts) {
      const cartProducts = await cartRepositories.getCartProductsByCartId(cart.id);
      for (const cartProduct of cartProducts) {
        const product = (cartProduct as IExtendedCartProduct).products;
        if (product.id === productId) {
          await updateCartProduct(cartProduct, quantity, product);
          return;
        }
      }
    }

    if (carts.length > 0) {
      const productToAdd = await productRepositories.findProductById(productId);
      for (const cart of carts) {
        const cartProducts = await cartRepositories.getCartProductsByCartId(cart.id);
        for (const cartProduct of cartProducts) {
          const product = (cartProduct as IExtendedCartProduct).products;
          if (product.shopId === productToAdd.shopId) {
            await addProductToExistingCart(cart, productToAdd, quantity);
            return;
          }
        }
      }
    }

    const createdCart = await cartRepositories.addCart({ userId, status: cartStatusEnum.PENDING });
    const product = await productRepositories.findProductById(productId);
    const totalPrice = product.price * quantity;
    const createdCartProduct = await cartRepositories.addCartProduct({
      cartId: createdCart.id,
      productId,
      quantity,
      price: product.price,
      discount: product.discount,
      totalPrice
    });

    res.status(httpStatus.CREATED).json({ message: "Cart added successfully", data: createdCartProduct });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message });
  }
};

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
      return res.status(httpStatus.OK).json({ message: "Cart quantity updated successfully" })
    }

    const product = await productRepositories.findProductById(productId);
    const existingFirstProduct = await productRepositories.findProductById(cartProducts[0].productId);
    if (cartProducts.length > 0 && existingFirstProduct.shopId === product.shopId) {
      await cartRepositories.addCartProduct({ cartId, productId, quantity, price: product.price, discount: product.discount, totalPrice: product.price * quantity })
      return res.status(httpStatus.OK).json({ message: "Cart product added successfully" })
    }

    const createdCart = await cartRepositories.addCart({ userId: req.user.id, status: cartStatusEnum.PENDING });
    const createdCartProduct = await cartRepositories.addCartProduct({
      cartId: createdCart.id,
      productId,
      quantity,
      price: product.price,
      discount: product.discount,
      totalPrice: product.price * quantity
    });
    return res.status(httpStatus.CREATED).json({ message: "Cart created successfully", data: createdCartProduct });
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
