/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import productRepositories from "../../product/repositories/productRepositories";
import { ExtendRequest, IExtendedCartProduct } from "../../../types";
import { cartStatusEnum } from "../../../enums";

const getProductDetails = (
  cartProducts: IExtendedCartProduct[]
): { productsDetails: any[]; cartTotal: number } => {
  let cartTotal = 0;

  const productsDetails = cartProducts.map((cartProduct) => {
    const product = cartProduct.products;
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

  return { productsDetails, cartTotal };
};

const buyerGetCart = async (req: ExtendRequest, res: Response) => {
  try {
    const cart = await cartRepositories.getCartByUserIdAndCartId(
      req.user.id,
      req.params.cartId
    );
    const cartProducts = await cartRepositories.getCartProductsByCartId(
      cart.id
    );
    const { productsDetails, cartTotal } = getProductDetails(cartProducts);

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

const buyerGetCarts = async (req: ExtendRequest, res: Response) => {
  try {
    const carts = await cartRepositories.getCartsByUserId(req.user.id);

    const allCartsDetails = await Promise.all(
      carts.map(async (cart) => {
        const cartProducts = await cartRepositories.getCartProductsByCartId(
          cart.id
        );
        const { productsDetails, cartTotal } = getProductDetails(cartProducts);

        return {
          cartId: cart.id,
          products: productsDetails,
          total: cartTotal,
        };
      })
    );

    return res.status(httpStatus.OK).json({
      message: "Buyer's all carts",
      data: allCartsDetails,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const addProductToExistingCart = async (cart, product, quantity, res) => {
  await cartRepositories.addCartProduct({
    cartId: cart.id,
    productId: product.id,
    quantity,
    price: product.price,
    discount: product.discount,
    totalPrice: product.price * quantity,
  });

  const cartProducts = await cartRepositories.getCartProductsByCartId(cart.id);
  const { productsDetails, cartTotal } = getProductDetails(cartProducts);

  return res.status(httpStatus.OK).json({
    message: "Product added to existing Cart",
    data: {
      cartId: cart.id,
      products: productsDetails,
      total: cartTotal,
    },
  });
};

const updateCartProduct = async (cartProduct, quantity, res) => {
  await cartRepositories.updateCartProduct(cartProduct.id, {
    quantity,
    totalPrice: cartProduct.products.price * quantity,
  });

  const cartProducts = await cartRepositories.getCartProductsByCartId(
    cartProduct.cartId
  );
  const { productsDetails, cartTotal } = getProductDetails(cartProducts);

  return res.status(httpStatus.OK).json({
    message: "Cart quantity updated successfully",
    data: {
      cartId: cartProduct.cartId,
      products: productsDetails,
      total: cartTotal,
    },
  });
};

const buyerCreateUpdateCart = async (req: ExtendRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const carts = await cartRepositories.getCartsByUserId(userId);

    for (const cart of carts) {
      const cartProducts = await cartRepositories.getCartProductsByCartId(
        cart.id
      );
      for (const cartProduct of cartProducts) {
        const product = (cartProduct as IExtendedCartProduct).products;
        if (product.id === productId) {
          return updateCartProduct(cartProduct, quantity, res);
        }
      }
    }

    if (carts.length > 0) {
      const productToAdd = await productRepositories.findProductById(productId);
      for (const cart of carts) {
        const cartProducts = await cartRepositories.getCartProductsByCartId(
          cart.id
        );
        for (const cartProduct of cartProducts) {
          const product = (cartProduct as IExtendedCartProduct).products;
          if (product.shopId === productToAdd.shopId) {
            return addProductToExistingCart(cart, productToAdd, quantity, res);
          }
        }
      }
    }

    const createdCart = await cartRepositories.addCart({
      userId,
      status: cartStatusEnum.PENDING,
    });
    const product = await productRepositories.findProductById(productId);
    await cartRepositories.addCartProduct({
      cartId: createdCart.id,
      productId,
      quantity,
      price: product.price,
      discount: product.discount,
      totalPrice: product.price * quantity,
    });

    const cartProducts = await cartRepositories.getCartProductsByCartId(
      createdCart.id
    );
    const { productsDetails, cartTotal } = getProductDetails(cartProducts);

    res.status(httpStatus.CREATED).json({
      message: "Cart added successfully",
      data: {
        cartId: createdCart.id,
        products: productsDetails,
        total: cartTotal,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const buyerClearCartProduct = async (req: ExtendRequest, res: Response) => {
  try {
    await cartRepositories.deleteCartProduct(
      req.cart.id,
      req.product.productId
    );
    res
      .status(httpStatus.OK)
      .json({ message: "Cart product cleared successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const buyerClearCart = async (req: ExtendRequest, res: Response) => {
  try {
    await cartRepositories.deleteAllCartProducts(req.cart.id);

    await cartRepositories.deleteCartById(req.cart.id);

    res
      .status(httpStatus.OK)
      .json({ message: "All products in cart cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const buyerClearCarts = async (req: ExtendRequest, res: Response) => {
  try {
    for (const cart of req.carts) {
      await cartRepositories.deleteAllCartProducts(cart.id);
    }

    await cartRepositories.deleteAllUserCarts(req.user.id);

    res
      .status(httpStatus.OK)
      .json({ message: "All carts cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

export {
  buyerGetCart,
  buyerGetCarts,
  buyerClearCart,
  buyerClearCarts,
  buyerCreateUpdateCart,
  buyerClearCartProduct,
};