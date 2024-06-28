/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stripe } from "stripe";
import cartRepositories from "../modules/cart/repositories/cartRepositories";
import httpStatus from "http-status";
import { Response,Request } from "express";

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