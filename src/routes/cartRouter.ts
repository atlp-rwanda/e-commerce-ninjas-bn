/* eslint-disable comma-dangle */
import { Router } from "express";
import { userAuthorization } from "../middlewares/authorization";
import { isCartExist, isCartIdExist, isProductIdExist, validation } from "../middlewares/validation";
import cartControllers from "../modules/cart/controller/cartControllers";
import { cartSchema } from "../modules/cart/validation/cartValidations";

const router: Router = Router();

router.post(
  "/buyer-create-cart",
  userAuthorization(["buyer"]),
  validation(cartSchema),
  isProductIdExist,
  cartControllers.buyerAddCart
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

router.put(
  "/buyer-update-cart/:cartId",
  userAuthorization(["buyer"]),
  validation(cartSchema),
  isCartIdExist,
  isProductIdExist,
  cartControllers.buyerUpdateCart
);

export default router;