/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Stripe from "stripe";
import db from "../../../databases/models";
import CartProduct from "../../../databases/models/cartProducts";
import Products from "../../../databases/models/products";
const stripe = new Stripe(process.env.STRIPE_SECRET);
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

const getCartsByProductId = async (productId: string, userId: string) => {
  return await db.Carts.findOne(
    { where: 
    { userId: userId }, 
    include: [ 
      { model: db.CartProducts, 
        as: "cartProducts", 
        where: { productId: productId } }, 
        { model: db.Orders, 
          as: "order" } ]
  });
};
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
const findCartIdbyUserId = async(userId: string)=>{
  return await db.Carts.findOne({where:{userId}})
}
const findCartProductByCartId = async(cartId: string)=>{
  return await db.CartProducts.findAll({where:{cartId:cartId}})
}
const findProductById = async(productId: string)=>{
  return  await db.Products.findByPk(productId)
}
const saveOrder = async(lineItems: any, shopIds: any, productIds: any, session: any, cartId: any,paymentMethodId:any)=> {
  const products = productIds.map((productId: any) => ({
      productId,
      status: "pending"
  }));
  const order =  {
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
const getStripeCustomerByAttribute =  async (attribute, value) => {
  const customers = await stripe.customers.list({
    [attribute]: value,
    limit: 1,
  });
  return customers.data.length ? customers.data[0] : null;
};
const createStripeCustomer=  async (customer) => {
  return await stripe.customers.create(customer);
}
const getStripeProductByAttribute = async (attribute, value) => {
  const products = await stripe.products.list({
    limit: 100, // Adjust limit based on your needs
  });

  return products.data.find(product => product[attribute] === value) || null;
}
const createStripeProduct = async (productInfo) => {
  const discountPercentage = parseFloat(productInfo.discount.replace("%", ""));
  const unitAmount = Math.round(productInfo.price * 100 * (1 - discountPercentage / 100)); // Calculate the discounted amount in cents

  return await stripe.products.create({
    name: productInfo.name,
    description: productInfo.description,
    images: productInfo.images.slice(0, 4), // Limit to 4 images
    default_price_data: {
      unit_amount: unitAmount,
      currency: "usd",
    },
  });
};

const getStripePriceByAttribute = async (attribute, value) => {
  const prices = await stripe.prices.list({
    [attribute]: value,
    limit: 1,
  });

  return prices.data.length ? prices.data[0] : null;
};

const createStripePrice = async (priceInfo) => {
  const discountPercentage = parseFloat(priceInfo.discount.replace("%", ""));
  const unitAmount = Math.round(priceInfo.price * 100 * (1 - discountPercentage / 100)); // Calculate the discounted amount in cents

  return await stripe.prices.create({
    product: priceInfo.product,
    unit_amount: unitAmount,
    currency: "usd",
  });
};


const getStripeSessionByAttribute = async (attribute, value) => {
  const sessions = await stripe.checkout.sessions.list({
    [attribute]: value,
    limit: 1,
  });
  return sessions.data.length ? sessions.data[0] : null;
}
const createStripeSession = async (sessionInfo: any) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: sessionInfo.payment_method_types,
    mode: sessionInfo.mode,
    line_items: [
      {
        quantity: sessionInfo.quantity,
        price: sessionInfo.price,
      },
    ],
    success_url: sessionInfo.success_url, 
    cancel_url: sessionInfo.cancel_url,  
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
  getCartsByProductId,
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
  getStripeCustomerByAttribute,
  createStripeCustomer,
  getStripeProductByAttribute,
  createStripeProduct,
  getStripePriceByAttribute,
  createStripePrice,
  getStripeSessionByAttribute,
  createStripeSession

};