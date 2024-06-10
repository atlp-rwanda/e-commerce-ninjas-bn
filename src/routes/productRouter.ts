/* eslint-disable comma-dangle */
import { Router } from "express";
import productController from "../modules/product/controller/productController";
import { userAuthorization } from "../middlewares/authorization";
import {
  validation,
  isProductExist,
  isShopExist,
  transformFilesToBody,
  isSellerShopExist,
} from "../middlewares/validation";
import {
  shopSchema,
  productSchema,
  statisticsSchema,
  statusSchema,
} from "../modules/product/validation/productValidation";
import upload from "../helpers/multer";

const router: Router = Router();

router.post(
  "/seller-create-product",
  userAuthorization(["seller"]),
  upload.array("images"),
  transformFilesToBody,
  validation(productSchema),
  isProductExist,
  productController.sellerCreateProduct
);
router.post(
  "/seller-create-shop",
  userAuthorization(["seller"]),
  validation(shopSchema),
  isShopExist,
  productController.sellerCreateShop
);
router.delete(
  "/seller-delete-product/:id",
  userAuthorization(["seller"]),
  isProductExist,
  productController.sellerDeleteProduct
);
router.post(
  "/seller-statistics",
  validation(statisticsSchema),
  userAuthorization(["seller"]),
  productController.sellerGetStatistics
);
router.put(
  "/seller-update-product/:id",
  userAuthorization(["seller"]),
  upload.array("images"),
  transformFilesToBody,
  validation(productSchema),
  isProductExist,
  productController.sellerUpdateProduct
);

router.put(
  "/seller-update-product-status/:id",
  userAuthorization(["seller"]),
  validation(statusSchema),
  productController.updateProductStatus
);
router.get(
  "/seller-get-products",
  userAuthorization(["seller"]),
  isSellerShopExist,
  productController.sellerGetProducts
);

export default router;