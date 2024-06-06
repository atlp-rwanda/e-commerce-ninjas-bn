import { Router } from "express"
import productControllers from "../modules/product/controller/productControllers";

import { userAuthorization } from "../middlewares/authorization";
import { validation, isProductExist, isShopExist, transformFilesToBody } from "../middlewares/validation";
import { shopSchema, productSchema} from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";
import { getShopProducts,getBuyerProducts } from "../middlewares/validation";

const router: Router = Router()

router.post("/create-product", userAuthorization(["seller"]), upload.array("images"), transformFilesToBody,validation(productSchema), isProductExist, productControllers.createProduct);
router.post("/create-shop", userAuthorization(["seller"]), validation(shopSchema), isShopExist, productControllers.createShop)
router.get("/shop-products", userAuthorization(["seller"]),getShopProducts,productControllers.paginatedProducts)
router.get("/all-products",getBuyerProducts)

export default router;