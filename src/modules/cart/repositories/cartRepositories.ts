/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Stripe from "stripe";
import db from "../../../databases/models";
import CartProduct from "../../../databases/models/cartProducts";
import Products from "../../../databases/models/products";
import { stripe } from "../../../services/stripe.service";
const getCartsByUserId = async (userId: string) => {
  return await db.Carts.findOne({
    where: { userId, status: "pending" },
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
const getCartsByUserId1 = async (userId: string) => {
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
        attributes: ["id", "name", "price", "discount", "images", "shopId", "description"],
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
const findCartByAttributes = async (key1: string, value1: any, key2: string, value2: any): Promise<any> => {
  return await db.Carts.findOne({ where: { [key1]: value1, [key2]: value2 } })
}

const getCartsByProductId = async (productId: string, userId: string) => {
  return await db.Carts.findOne(
    {
      where:
        { userId: userId },
      include: [
        {
          model: db.CartProducts,
          as: "cartProducts",
          where: { productId: productId }
        },
        {
          model: db.Orders,
          as: "order"
        }]
    });
};
const findCartProductsByCartId = async (value: any) => {
  const result = await CartProduct.findAll({
    where: { "cartId": value },
    include: [{
      model: Products,
      as: "products",
      attributes: ["id", "name", "discount", "description", "category", "images"]
    }],
    attributes: ["id", "quantity", "discount", "price", "totalPrice"]
  })
  return result;
};

const getCartByUserIdAndCartId = async (userId: string, cartId: string) => {
  return await db.Carts.findOne({
    where: { id: cartId, userId, status: "pending" },
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
const findCartIdbyUserId = async (userId: string) => {
  return await db.Carts.findOne({ where: { userId } })
}
const findCartProductByCartId = async (cartId: string) => {
  return await db.CartProducts.findAll({ where: { cartId: cartId } })
}
const findProductById = async (productId: string) => {
  return await db.Products.findByPk(productId)
}
const saveOrder = async (lineItems: any, shopIds: any, productIds: any, session: any, cartId: any, paymentMethodId: any) => {
  const products = productIds.map((productId: any) => ({
    productId,
    status: "pending"
  }));
  const order = {
    shopId: shopIds[0],
    products: products,
    cartId: cartId,
    paymentMethodId: paymentMethodId,
    orderDate: new Date(),
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return await db.Orders.create(order)
}

const getOrderByOrderIdAndUserId = async (orderId: string, userId: string) => {
  return await db.Orders.findOne({
    where: { id: orderId },
    include: [
      {
        model: db.Carts,
        as: "carts",
        where: { userId: userId }
      }
    ]
  })
}

const getOrdersByCartId = async (userId) => {
  return await db.Orders.findAll({
    include: [
      {
        model: db.Carts,
        as: "carts",
        where: { userId: userId }
      }
    ],
    order: [
      ["createdAt", "DESC"]
    ]
  });
};
const getOrderByCartId = async (userId) => {
  return await db.Orders.findOne({
    include: [
      {
        model: db.Carts,
        as: "carts",
        where: { userId: userId }
      }
    ]
  });
};
const getOrderByCartId2 = async (userId,orderId) => {
  return await db.Orders.findOne({
    where: {id: orderId },
    include: [
      {
        model: db.Carts,
        as: "carts",
        where: { userId: userId }
      }
    ]
  });
};

const getOrderById = async (orderId: string) => {
  return await db.Orders.findOne({ where: { id: orderId } })
}

const updateOrderStatus = async (orderId: string, status: string, shippingProcess: string) => {
  return await db.Orders.update(
    {
      status: status,
      shippingProcess: shippingProcess
    },
    { where: { id: orderId } }
  );
};
const getOrdersByUserId = async (userId: string) => {
  return await db.Carts.findOne(
    {
      where:
        { userId: userId },
      include: [
        {
          model: db.Orders,
          as: "orders",
        }
      ]
    });
};

const getOrdersHistory = async () => {
  return await db.Orders.findAll();
};


const getStripeProductByAttribute = async (primaryKey: string, primaryValue: number | string | boolean): Promise<Stripe.Product> => {
  const product = await stripe.products.search({ query: `${primaryKey}: '${primaryValue}'` });
  return product.data[0];
};
const createStripeProduct = async (body: Stripe.ProductCreateParams): Promise<Stripe.Product> => {
  return await stripe.products.create(body);
};

const getStripeCustomerByAttribute = async (primaryKey: string, primaryValue: number | string | boolean): Promise<Stripe.Customer> => {
  const customer = await stripe.customers.search({ query: `${primaryKey}: '${primaryValue}'` });
  return customer.data[0];
};
const createStripeCustomer = async (body: Stripe.CustomerCreateParams): Promise<Stripe.Customer> => {
  return await stripe.customers.create(body);
};
const getStripeSessionByAttribute = async (primaryKey: string, primaryValue: number | string | boolean): Promise<Stripe.Checkout.Session> => {
  const subscription = await stripe.checkout.sessions.list({ [primaryKey]: primaryValue });
  return subscription.data[0];
};
const createStripeSession = async (body: Stripe.Checkout.SessionCreateParams): Promise<Stripe.Checkout.Session> => {
  return await stripe.checkout.sessions.create(body);
};
const updateCartStatus = async (cartId: string, status: string) => {

  return await db.Carts.update({ status: status },
    { where: { id: cartId } })
}



const userSaveOrder = async (body) => {
  return await db.Orders.create(body);
}
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
  getCartsByProductId,
  getCartsByUserId1,
  findCartProductsByCartId,
  getCartByUserIdAndCartId,
  findCartProductByCartId,
  findCartIdbyUserId,
  findProductById,
  saveOrder,
  getOrderByOrderIdAndUserId,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  createStripeProduct, getStripeProductByAttribute,
  createStripeCustomer, getStripeCustomerByAttribute,
  createStripeSession, getStripeSessionByAttribute,
  getOrdersHistory,
  updateCartStatus,
  userSaveOrder,
  getOrdersByCartId,
  getOrderByCartId,
  getOrderByCartId2
};