import { Router } from "express"
import productController from "../modules/product/controller/productControllers";

import { userAuthorization } from "../middlewares/authorization";
import { getShopProducts,getBuyerProducts } from "../middlewares/validation";

const router: Router = Router()
router.get("/shop-products", userAuthorization(["seller"]),getShopProducts,productController.paginatedProducts)
router.get("/all-products",getBuyerProducts)

export default router;