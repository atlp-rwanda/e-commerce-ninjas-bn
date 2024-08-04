/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stripe } from "stripe";
import cartRepositories from "../modules/cart/repositories/cartRepositories";
import httpStatus from "http-status";
import { Response, Request } from "express";



// const stripe = new Stripe(process.env.STRIPE_SECRET);
// const buyerPayCart = async (req: ExtendRequest, res: Response) => {
//   try {
//     const cartData: any = req.cart;
//     const line_items: any[] = [];
//     const shopIds: any[] = [];
//     const productIds: any[] = [];

//     for (const cartProduct of cartData.cartProducts) {
//       const productDetails = cartProduct.products;
//       let unitAmount = productDetails.price * 100;
//       const discountPercentage = parseFloat(productDetails.discount.replace("%", ""));
//       unitAmount = unitAmount * (1 - (discountPercentage / 100));
//       unitAmount = Math.round(unitAmount);
//       line_items.push({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: productDetails.name,
//             images: productDetails.images
//           },
//           unit_amount: unitAmount
//         },
//         quantity: cartProduct.quantity
//       });
//       shopIds.push(productDetails.shopId);
//       productIds.push(cartProduct.productId);
//     }
//     const session = await stripe.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.SERVER_URL_PRO}/api/cart/payment-success`,
//       cancel_url: `${process.env.SERVER_URL_PRO}/api/cart/payment-cancel`,
//       metadata: {
//         cartId: cartData.id.toString(),
//         shopIds: JSON.stringify(shopIds),
//         productIds: JSON.stringify(productIds)
//       }
//     });
//     res.status(httpStatus.OK).json({ payment_url: session.url });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
//   }
// };
// const paymentSuccess = (req: Request, res: Response) => {
//   try {
//     res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Payment successful!" });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
//   }
// };
// const paymentCanceled = (req: Request, res: Response) => {
//   try {
//     res.status(httpStatus.OK).json({ status: httpStatus.OK, message: "Payment canceled" });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
//   }
// };

const stripe = new Stripe(process.env.STRIPE_SECRET);
export const webhook = async (req: Request, res: Response) => {
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
          const order = await cartRepositories.saveOrder(lineItems.data, shopIds, productIds, session, cartId, paymentMethodId);
          return res.status(httpStatus.CREATED).json({ status: httpStatus.CREATED, message: "Order created successfully,", data: { order } })
        } catch (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: err.message })
        }
        break;
      case "payment_intent.succeeded":
        return res.status(httpStatus.OK).json({ status: httpStatus.CREATED, message: "Order saved successfully", data: session })
        break;
      case "payment_method.attached":
        break;
      default:
        return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Error: Unknow error occured" })
    }
    res.json({ received: true });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
  }
};


export const stripeCreateProduct = async (req, res) => {
  try {
    const product = await cartRepositories.createStripeProduct(req.body.planInfo);
    return res.status(httpStatus.OK).json({ message: "Success.", data: { product } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message })
  }
};

export const stripeCheckoutSession = async (req, res) => {
  try {
    let customer = await cartRepositories.getStripeCustomerByAttribute("email", req.body.sessionInfo.customer_email);
    if (!customer) customer = await cartRepositories.createStripeCustomer({ email: req.body.sessionInfo.customer_email });
    delete req.body.sessionInfo.customer_email;
    req.body.sessionInfo.customer = customer.id;
    const session = await cartRepositories.createStripeSession(req.body.sessionInfo);
    return res.status(httpStatus.OK).json({ message: "Success.", data: { session } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.message })
  }
};
