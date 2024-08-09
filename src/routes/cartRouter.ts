/* eslint-disable comma-dangle */
import { Router } from "express";
import { userAuthorization } from "../middlewares/authorization";
import {
  isCartExist,
  isCartIdExist,
  isCartProductExist,
  isProductIdExist,
  validation,
  isOrderExist,
  isOrderEmpty,
  isCartExist1,
  isOrdersExist,
  isOrderExists,
  isOrderExists2
} from "../middlewares/validation";
import * as cartControllers from "../modules/cart/controller/cartControllers";
import { cartSchema, checkoutSessionSchema, productDetailsSchema, updateCartStatusSchema, updateOrderStatusSchema } from "../modules/cart/validation/cartValidations";
import { stripeCreateProduct, stripeCheckoutSession } from "../services/stripe";

const router: Router = Router();

router.post(
  "/create-update-cart",
  userAuthorization(["buyer"]),
  validation(cartSchema),
  isProductIdExist,
  cartControllers.buyerCreateUpdateCart
);

router.get(
  "/buyer-get-carts",
  userAuthorization(["buyer"]),
  cartControllers.buyerGetCarts
);


router.get(
  "/buyer-get-cart/:cartId",
  userAuthorization(["buyer"]),
  isCartIdExist,
  cartControllers.buyerGetCart
);

router.delete(
  "/buyer-clear-cart-product/:cartId/:productId",
  userAuthorization(["buyer"]),
  isCartIdExist,
  isCartProductExist,
  cartControllers.buyerClearCartProduct
);

router.delete(
  "/buyer-clear-cart/:cartId",
  userAuthorization(["buyer"]),
  isCartIdExist,
  cartControllers.buyerClearCart
);

router.delete(
  "/buyer-clear-carts",
  userAuthorization(["buyer"]),
  isCartExist1,
  cartControllers.buyerClearCarts
);
router.get(
  "/buyer-cart-checkout/:cartId",
  userAuthorization(["buyer"]),
  isCartIdExist,
  cartControllers.buyerCheckout
);


router.get("/user-get-order-status/:id", userAuthorization(["buyer"]), isOrderExists2, cartControllers.buyerGetOrderStatus2)
router.put("/admin-update-order-status/:id", userAuthorization(["admin"]), validation(updateOrderStatusSchema), isOrderExist, cartControllers.adminUpdateOrderStatus)
router.get("/buyer-get-order-history", userAuthorization(["buyer"]), isOrderExist, cartControllers.buyerGetOrders)
router.get("/buyer-get-orders-history", userAuthorization(["buyer"]), isOrdersExist, cartControllers.buyerGetOrders2)

router.post("/create-stripe-product", userAuthorization(["buyer"]), validation(productDetailsSchema), stripeCreateProduct);
router.post("/checkout-stripe-session", userAuthorization(["buyer"]), validation(checkoutSessionSchema), stripeCheckoutSession);
router.post("/user-create-order",userAuthorization(["buyer"]), cartControllers.userCreateOrder)
router.put("/update-cart-status",userAuthorization(["buyer"]), cartControllers.buyerUpdateCartStatus)
router.get("/admin-get-order-history",userAuthorization(["admin"]),isOrderEmpty,cartControllers.adminGetOrdersHistory)
export default router;