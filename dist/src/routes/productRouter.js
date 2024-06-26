"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable comma-dangle */
const express_1 = require("express");
const productController = __importStar(require("../modules/product/controller/productController"));
const authorization_1 = require("../middlewares/authorization");
const validation_1 = require("../middlewares/validation");
const productValidation_1 = require("../modules/product/validation/productValidation");
const multer_1 = __importDefault(require("../helpers/multer"));
const router = (0, express_1.Router)();
router.post("/seller-create-product", (0, authorization_1.userAuthorization)(["seller"]), multer_1.default.array("images"), validation_1.transformFilesToBody, (0, validation_1.validation)(productValidation_1.productSchema), validation_1.isProductExist, productController.sellerCreateProduct);
router.post("/seller-create-shop", (0, authorization_1.userAuthorization)(["seller"]), (0, validation_1.validation)(productValidation_1.shopSchema), validation_1.isShopExist, productController.sellerCreateShop);
router.delete("/seller-delete-product/:id", (0, authorization_1.userAuthorization)(["seller"]), validation_1.isProductExist, productController.sellerDeleteProduct);
router.post("/seller-statistics", (0, validation_1.validation)(productValidation_1.statisticsSchema), (0, authorization_1.userAuthorization)(["seller"]), productController.sellerGetStatistics);
router.put("/seller-update-product/:id", (0, authorization_1.userAuthorization)(["seller"]), multer_1.default.array("images"), (0, validation_1.validation)(productValidation_1.productUpdateSchema), validation_1.isProductExist, productController.sellerUpdateProduct);
router.put("/seller-update-product-status/:id", (0, authorization_1.userAuthorization)(["seller"]), (0, validation_1.validation)(productValidation_1.statusSchema), productController.updateProductStatus);
router.get("/seller-get-products", (0, authorization_1.userAuthorization)(["seller"]), validation_1.isSellerShopExist, validation_1.isPaginated, productController.sellerGetProducts);
router.get("/user-get-products", validation_1.isPaginated, productController.userGetProducts);
router.get("/user-search-products", validation_1.isSearchFiltered, validation_1.isPaginated, productController.userSearchProducts);
router.get("/user-get-product/:id", validation_1.isProductExistById, productController.userGetProduct);
router.get("/seller-get-product/:id", (0, authorization_1.userAuthorization)(["seller"]), validation_1.isSellerShopExist, validation_1.isProductExistById, productController.sellerGetProduct);
router.post("/buyer-add-product-wishList/:id", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isProductExistToWishlist, productController.buyerAddProductToWishList);
router.get("/buyer-view-whishlist-product", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isUserWishlistExist, productController.buyerViewWishLists);
router.get("/buyer-view-whishlist-product/:id", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isUserWishlistExistById, productController.buyerViewWishList);
router.delete("/delete-whishlist-products", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isUserWishlistExist, productController.buyerDeleteAllProductFromWishlist);
router.delete("/delete-whishlist-product/:id", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isUserWishlistExistById, productController.buyerDeleteProductFromWishList);
exports.default = router;
//# sourceMappingURL=productRouter.js.map