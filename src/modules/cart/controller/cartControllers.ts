/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response,Request } from "express";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import productRepositories from "../../product/repositories/productRepositories";
import { ExtendRequest, IExtendedCartProduct } from "../../../types";
import { cartStatusEnum } from "../../../enums";
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
      status:httpStatus.OK,
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
      status: httpStatus.OK,
      message: "Buyer's all carts",
      data: {allCartsDetails}
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
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
    totalPrice: discountedPrice  * quantity,
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
      error: error.message
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
      .json({status: httpStatus.OK, message: "Cart product cleared successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const buyerClearCart = async (req: ExtendRequest, res: Response) => {
  try {
    await cartRepositories.deleteAllCartProducts(req.cart.id);

    await cartRepositories.deleteCartById(req.cart.id);

    res
      .status(httpStatus.OK)
      .json({status:httpStatus.OK, message: "All products in cart cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
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
      .json({status:httpStatus.OK, message: "All carts cleared successfully!" });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
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
      data: { totalAmount,cart }
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message 
    });
  }
};
const stripe = new Stripe(process.env.STRIPE_SECRET);
 const checkout = async (req: ExtendRequest, res: Response) => {
    try {
        const { id } = req.user;
        const cart: any = await cartRepositories.findCartIdbyUserId(id);
        const products: any[] = await cartRepositories.findCartProductByCartId(cart.id);

        const line_items: any[] = [];
        const shopIds: any[] = [];
        const productIds: any[] = [];

        await Promise.all(products.map(async (item) => {
            const productDetails = await cartRepositories.findProductById(item.productId);
            line_items.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: productDetails.name,
                        images: [productDetails.images[0]]
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            });
            shopIds.push(productDetails.shopId);
            productIds.push(item.productId);  
            
        }));
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: process.env.SERVER_URL_SUCCESS,
            cancel_url: process.env.SERVER_URL_CANCEL,
            metadata: {
                cartId: cart.id.toString(),
                shopIds: JSON.stringify(shopIds),
                productIds: JSON.stringify(productIds) 
            }
        });
        res.status(200).json({ payment_url: session.url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
const webhook = async (req: Request, res: Response) => {
    const sign = req.headers["stripe-signature"] as string;
    const webhookSecret: string = process.env.WEBHOOK_SECRET;
    let event;
    try {
        try {
            event = stripe.webhooks.constructEvent(req.body, sign, webhookSecret);
          } catch (err) {
            console.error("Webhook signature verification failed.", err.message);
          }
          const session = event.data.object;
        switch (event.type) {
            case "checkout.session.completed":
                try {
                    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                    const shopIds = JSON.parse(session.metadata.shopIds);
                    const productIds = JSON.parse(session.metadata.productIds); 
                    const cartId = session.metadata.cartId;
                    const paymentMethodId = session.payment_intent; 
                    const order = await cartRepositories.saveOrder(lineItems.data, shopIds, productIds, session, cartId,paymentMethodId);
                    return res.status(httpStatus.CREATED).json({ status: httpStatus.CREATED,message:"Order created successfully,", data: {order}})
                } catch (err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: err.message })
                }
                break;
            case "payment_intent.succeeded":
                return res.status(httpStatus.OK).json({ status: httpStatus.CREATED,message:"Order saved successfully", data:session})
                break;
            case "payment_method.attached":
                break;
            default:
                return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message:"Error: Unknow error occured"})
        }
        res.json({ received: true });
    } catch (error: any) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

export {
  buyerGetCart,
  buyerGetCarts,
  buyerClearCart,
  buyerClearCarts,
  buyerCreateUpdateCart,
  buyerClearCartProduct,
  buyerCheckout,
  checkout,
  webhook
};