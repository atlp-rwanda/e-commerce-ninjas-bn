import { Router } from "express"
import productController from "../modules/product/controller/productController";

import { userAuthorization } from "../middlewares/authorization";
import { validation, isProductExist, isShopExist, transformFilesToBody } from "../middlewares/validation";
import { shopSchema, productSchema} from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";

const router: Router = Router()

router.post("/create-product", userAuthorization(["seller"]), upload.array("images"), transformFilesToBody,validation(productSchema), isProductExist, productController.createProduct);
router.post("/create-shop", userAuthorization(["seller"]), validation(shopSchema), isShopExist, productController.createShop)

export default router;