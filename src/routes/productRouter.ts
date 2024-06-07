import {Router} from "express"
import productController from "../modules/product/controller/productController";
import { userAuthorization } from "../middlewares/authorization";
import { validation, isProductExist, isShopExist, transformFilesToBody,isShopExists, productsByCategory } from "../middlewares/validation";
import { shopSchema, productSchema} from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";

const router: Router = Router()

router.post("/seller-create-product", userAuthorization(["seller"]), upload.array("images"), transformFilesToBody,validation(productSchema), isProductExist, productController.createProduct);
router.post("/seller-create-shop", userAuthorization(["seller"]), validation(shopSchema), isShopExist, productController.createShop)
router.get("/seller-get-shop-products",userAuthorization(["seller"]),isShopExists,productController.getShopProducts)
router.get("/user-get-products",productsByCategory, productController.getAvailableProducts)
export default router;