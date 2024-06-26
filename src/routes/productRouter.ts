/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
import { Router } from "express";
import * as productController from "../modules/product/controller/productController";
import { userAuthorization } from "../middlewares/authorization";
import {
  validation,
  isProductExist,
  isShopExist,
  transformFilesToBody,
  isSellerShopExist,
  isPaginated,
  isSearchFiltered,
  isProductExistById,
  isProductExistToWishlist,
  isUserWishlistExist,
  isUserWishlistExistById,
} from "../middlewares/validation";
import {
  shopSchema,
  productSchema,
  statisticsSchema,
  statusSchema,
  productUpdateSchema,
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
  validation(productUpdateSchema),
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
  isPaginated,
  productController.sellerGetProducts
);

router.get(
  "/user-get-products",
  isPaginated,
  productController.userGetProducts
);

router.get(
  "/user-search-products",
  isSearchFiltered,
  isPaginated,
  productController.userSearchProducts
);

router.get(
  "/user-get-product/:id",
  isProductExistById,
  productController.userGetProduct
);
router.get(
  "/seller-get-product/:id",
  userAuthorization(["seller"]),
  isSellerShopExist,
  isProductExistById,
  productController.sellerGetProduct
);

router.post(
  "/buyer-add-product-wishList/:id",
  userAuthorization(["buyer"]),
  isProductExistToWishlist,
  productController.buyerAddProductToWishList
);
router.get(
  "/buyer-view-whishlist-product",
  userAuthorization(["buyer"]),
  isUserWishlistExist,
  productController.buyerViewWishLists
);
router.get(
  "/buyer-view-whishlist-product/:id",
  userAuthorization(["buyer"]),
  isUserWishlistExistById,
  productController.buyerViewWishList
);
router.delete(
  "/delete-whishlist-products",
  userAuthorization(["buyer"]),
  isUserWishlistExist,
  productController.buyerDeleteAllProductFromWishlist
);
router.delete(
  "/delete-whishlist-product/:id",
  userAuthorization(["buyer"]),
  isUserWishlistExistById,
  productController.buyerDeleteProductFromWishList
);

export default router;
