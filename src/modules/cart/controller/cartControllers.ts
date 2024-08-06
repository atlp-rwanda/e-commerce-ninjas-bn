/* eslint-disable */
import { Response, Request } from "express";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import productRepositories from "../../product/repositories/productRepositories";
import { ExtendRequest, IExtendedCartProduct } from "../../../types";
import { cartStatusEnum } from "../../../enums";
import { eventEmitter } from "../../../helpers/notifications";
import { Stripe } from "stripe";

const getProductDetails = (
  cartProducts: IExtendedCartProduct[]
): { productsDetails: any[]; cartTotal: number } => {
  let cartTotal = 0;

  const productsDetails = cartProducts.map((cartProduct) => {
    const product = cartProduct.products;
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const totalPrice = cartProduct.quantity * discountedPrice;
    cartTotal += totalPrice;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.images[0],
      quantity: cartProduct.quantity,
      totalPrice: totalPrice,
      shopId: product.shopId,
      description: product.description
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
      status: httpStatus.OK,
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
      message: error.message,
    });
  }
};

const buyerGetCarts = async (req: ExtendRequest, res: Response) => {
  try {
    const carts = await cartRepositories.getCartsByUserId1(req.user.id);

    const allCartsDetails = await Promise.all(
      carts.map(async (cart) => {
        const cartProducts = await cartRepositories.getCartProductsByCartId(
          cart.id
        );
        const { productsDetails, cartTotal } = getProductDetails(cartProducts);

        return {
          cartId: cart.id,
          status: cart.status,
          products: productsDetails,
          total: cartTotal,
        };
      })
    );
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: "Buyer's all carts",
      data: { carts: allCartsDetails }
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const calculateDiscountedPrice = (price, discount) => {
  const discountPercentage = parseFloat(discount) / 100;
  return price - (price * discountPercentage);
};


const addProductToExistingCart = async (cart, product, quantity, res) => {
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  await cartRepositories.addCartProduct({
    cartId: cart.id,
    productId: product.id,
    quantity,
    price: product.price,
    discount: product.discount,
    totalPrice: discountedPrice * quantity,
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
  const discountedPrice = calculateDiscountedPrice(cartProduct.products.price, cartProduct.products.discount);
  await cartRepositories.updateCartProduct(cartProduct.id, {
    quantity,
    totalPrice: discountedPrice * quantity,
  });

  const cartProducts = await cartRepositories.getCartProductsByCartId(
    cartProduct.cartId
  );
  const { productsDetails, cartTotal } = getProductDetails(cartProducts);

  return res.status(httpStatus.OK).json({
    status: httpStatus.OK,
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
    const carts = await cartRepositories.getCartsByUserId1(userId);

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
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    await cartRepositories.addCartProduct({
      cartId: createdCart.id,
      productId,
      quantity,
      price: product.price,
      discount: product.discount,
      totalPrice: discountedPrice * quantity,
    });

    const cartProducts = await cartRepositories.getCartProductsByCartId(
      createdCart.id
    );
    const { productsDetails, cartTotal } = getProductDetails(cartProducts);

    res.status(httpStatus.CREATED).json({
      status: httpStatus.CREATED,
      message: "Cart added successfully",
      data: {
        cartId: createdCart.id,
        products: productsDetails,
        total: cartTotal
      }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
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
      .json({ status: httpStatus.OK, message: "Cart product cleared successfully" });
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
      .json({ status: httpStatus.OK, message: "All products in cart cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
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
      .json({ status: httpStatus.OK, message: "All carts cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};

const buyerCheckout = async (req: ExtendRequest, res: Response) => {
  try {
    const cart = req.cart
    let totalAmount = 0;
    cart.cartProducts.forEach(product => {
      totalAmount += product.totalPrice;
    });
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      data: { totalAmount, cart }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};
const buyerGetOrderStatus = async (req: ExtendRequest, res: Response) => {
  try {
    const order = req.order.shippingProcess
    return res.status(httpStatus.OK).json({
      message: "Order Status found successfully",
      data: { order }
    })

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    })
  }
}
const buyerGetOrderStatus2 = async (req, res) => {
  try {
    const order = await req.order
    return res.status(httpStatus.OK).json({
      status: httpStatus.OK, message: "Order retrieved successfully",
      data: {
        order
      }
    })
  } catch (error) {

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
  }
}
const buyerGetOrders = async (req: ExtendRequest, res: Response) => {
  try {
    const orders = req.order
    return res.status(httpStatus.OK).json({
      message: "Orders found successfully",
      data: { orders }
    })
  }
  catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    })
  }
}
const buyerGetOrders2 = (req, res) => {
  try {
    const orders = req.orders
    return res.status(httpStatus.OK).json({
      message: "Orders found successfully",
      data: { orders }
    })
  }
  catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    })
  }
}

const adminUpdateOrderStatus = async (req: ExtendRequest, res: Response) => {
  try {
    const order = req.order
    await cartRepositories.updateOrderStatus(req.params.id, req.body.status, req.body.shippingProcess);
    eventEmitter.emit("orderStatusUpdated", order);
    return res.status(httpStatus.OK).json({
      message: "Status updated successfully!",
      data: { order }
    })
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    })
  }

}

const stripeCreateProduct = async (req, res) => {
  try {
    let product = await cartRepositories.getStripeProductByAttribute('name', req.body.planInfo.name);
    if (!product) product = await cartRepositories.createStripeProduct(req.body.planInfo);
    return res.status(httpStatus.OK).json({ message: "Success.", data: { product } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message })
  }
};

const stripeCheckoutSession = async (req, res) => {
  try {
    let customer = await cartRepositories.getStripeCustomerByAttribute('email', req.body.sessionInfo.customer_email);
    if (!customer) customer = await cartRepositories.createStripeCustomer({ email: req.body.sessionInfo.customer_email });
    delete req.body.sessionInfo.customer_email;
    req.body.sessionInfo.customer = customer.id;
    const session = await cartRepositories.createStripeSession(req.body.sessionInfo);
    return res.status(httpStatus.OK).json({ message: "Success.", data: { session } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message })
  }
};

const buyerUpdateCartStatus = async (req, res) => {
  try {
    const { cartId, status } = req.body
    await cartRepositories.updateCartStatus(cartId, status);
    const updatedCart = await cartRepositories.getCartByUserIdAndCartId(req.user.id, cartId)
    return res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Cart status updated successfully", data: { updatedCart } })
  } catch (error) {
    console.log(error.message)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
  }
}
const userCreateOrder = (req, res) => {
  try {
    const userId = req.user.id;
    const body = {
      userId: userId,
      products: req.body.products,
      cartId: req.body.cartId,
      paymentMethodId: req.body.paymentMethodId,
      orderDate: new Date(),
      status: req.body.status,
      shippingProcess: "Order placed successfully!",
      shopId: req.body.shopId,
      expectedDeliveryDate: new Date(new Date().setDate(new Date().getDate() + 7))
    }

    const order = cartRepositories.userSaveOrder(body)
    return res.status(httpStatus.CREATED).json({ status: httpStatus.CREATED, message: "Order created succesfully", data: { order } })
  } catch (error) {
    console.log(error.message)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message })
  }
}


const adminGetOrdersHistory = async(req: ExtendRequest, res:Response)=>{
  const OrderHistory = (req as any).orders
  return res.status(httpStatus.OK).json({
    message: "Order History",
    data: { OrderHistory }
 })
}

export {
  buyerGetCart,
  buyerGetCarts,
  buyerClearCart,
  buyerClearCarts,
  buyerCreateUpdateCart,
  buyerClearCartProduct,
  updateCartProduct,
  calculateDiscountedPrice,
  getProductDetails,
  addProductToExistingCart,
  buyerGetOrderStatus,
  buyerGetOrders,
  buyerCheckout,
  adminUpdateOrderStatus,
  stripeCreateProduct,
  stripeCheckoutSession,
  buyerUpdateCartStatus,
  userCreateOrder,
  buyerGetOrders2,
  buyerGetOrderStatus2,
  adminGetOrdersHistory
};