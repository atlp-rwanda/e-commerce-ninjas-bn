/* eslint-disable comma-dangle */
import { Router } from "express";
import { userAuthorization } from "../middlewares/authorization";
import {
  isCartExist,
  isCartIdExist,
  isCartProductExist,
  isProductIdExist,
  validation,
  isOrderExist
} from "../middlewares/validation";
import * as cartControllers from "../modules/cart/controller/cartControllers";
import { cartSchema, updateOrderStatusSchema, orderStatusSchema } from "../modules/cart/validation/cartValidations";

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
  isCartExist,
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
  isCartExist,
  cartControllers.buyerClearCarts
);
router.get(
  "/buyer-cart-checkout/:cartId",
  userAuthorization(["buyer"]),
  isCartIdExist,
  cartControllers.buyerCheckout
  );

router.post("/user-get-order-status",userAuthorization(["buyer"]),validation(orderStatusSchema),isOrderExist, cartControllers.buyerGetOrderStatus )
router.put("/admin-update-order-status", userAuthorization(["admin"]),validation(updateOrderStatusSchema),isOrderExist, cartControllers.adminUpdateOrderStatus)
export default router;
