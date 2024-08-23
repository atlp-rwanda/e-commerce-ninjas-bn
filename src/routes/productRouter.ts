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
  isWishListExist,
  isUserWishlistExist,
  isProductOrdered,
  isProductExistIntoWishList,
  isWishListProductExist,
  isShopEmpty,
  isOrderExistByShopId
} from "../middlewares/validation";
import {
  shopSchema,
  productSchema,
  statisticsSchema,
  statusSchema,
  productUpdateSchema,
  productReviewSchema
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
  isProductExistById,
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
  isProductExistById,
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

router.post("/buyer-add-product-wishList/:id",userAuthorization(["buyer"]),isWishListExist,isWishListProductExist,productController.buyerAddProductToWishList)
router.get("/buyer-view-wishlist-products",userAuthorization(["buyer"]),isUserWishlistExist,productController.buyerViewWishListProducts)
router.get("/buyer-view-wishlist-product/:id",userAuthorization(["buyer"]),isUserWishlistExist,isProductExistIntoWishList,productController.buyerViewWishListProduct)
router.delete("/delete-wishlist",userAuthorization(["buyer"]),isUserWishlistExist,productController.buyerDeleteWishListProducts)
router.delete("/delete-wishlist-product/:id",userAuthorization(["buyer"]),isUserWishlistExist,isProductExistIntoWishList,productController.buyerDeleteWishListProduct)

router.post(
  "/buyer-review-product/:id",
  userAuthorization(["buyer"]),
  validation(productReviewSchema),
  isProductOrdered, 
  productController.buyerReviewProduct )
  router.get("/admin-get-shops",userAuthorization(["admin"]),isShopEmpty,productController.adminGetShops);
  router.get("/seller-get-orderHistory",userAuthorization(["seller"]),isOrderExistByShopId,productController.sellerGetOrdersHistory);
  router.get("/get-all-shops",isShopEmpty,productController.adminGetShops);
  router.get(
    "/get-products-by-shop/:id",
    productController.getProductsByShopId
  );
export default router;