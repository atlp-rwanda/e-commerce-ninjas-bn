import { Router } from "express"
import productController from "../modules/product/controller/productController";
import { userAuthorization } from "../middlewares/authorization";
import { validation, isProductExist, isShopExist, transformFilesToBody, sellersShop, productsByCategory } from "../middlewares/validation";
import { shopSchema, productSchema, statisticsSchema } from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";

const router: Router = Router()

router.post("/seller-create-product", userAuthorization(["seller"]), upload.array("images"), transformFilesToBody, validation(productSchema), isProductExist, productController.sellerCreateProduct);
router.post("/seller-create-shop", userAuthorization(["seller"]), validation(shopSchema), isShopExist, productController.sellerCreateShop)
router.delete("/seller-delete-product/:id", userAuthorization(["seller"]), isProductExist, productController.sellerDeleteProduct)
router.post("/seller-statistics", validation(statisticsSchema), userAuthorization(["seller"]), productController.sellerGetStatistics)
router.get("/seller-get-shop-products", userAuthorization(["seller"]), sellersShop, productController.getShopProducts)
router.get("/user-get-products", productsByCategory, productController.getAvailableProducts)

export default router;