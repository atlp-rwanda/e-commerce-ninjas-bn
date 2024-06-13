/* eslint-disable comma-dangle */
import { Router } from "express";
import { userAuthorization } from "../middlewares/authorization";
import { isCartExist } from "../middlewares/validation";
import cartControllers from "../modules/cart/controller/cartControllers";

const router: Router = Router();

router.get(
  "/buyer-get-cart",
  userAuthorization(["buyer"]),
  isCartExist,
  cartControllers.buyerGetCart
);

export default router;