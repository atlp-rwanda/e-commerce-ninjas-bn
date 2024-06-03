import { Router } from "express"
import productController from "../modules/product/controller/productController";

import { userAuthorization } from "../middlewares/authorization";
import { validation, isProductExist, isCollectionExist, transformFilesToBody,productsPagination } from "../middlewares/validation";
import { collectionSchema, productSchema } from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";

const router: Router = Router()

router.post("/create-product/:id", userAuthorization(["seller"]), upload.array("images"), transformFilesToBody, validation(productSchema), isProductExist, productController.createProduct);
router.post("/create-collection", userAuthorization(["seller"]), validation(collectionSchema), isCollectionExist, productController.createCollections)
router.get("/seller-products", userAuthorization(["seller"]),productsPagination,productController.paginatedProducts)
router.get("/buyer-products", userAuthorization(["buyer"]),productsPagination,productController.paginatedProducts)

export default router;