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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable comma-dangle */
const express_1 = require("express");
const authorization_1 = require("../middlewares/authorization");
const validation_1 = require("../middlewares/validation");
const cartControllers = __importStar(require("../modules/cart/controller/cartControllers"));
const cartValidations_1 = require("../modules/cart/validation/cartValidations");
const router = (0, express_1.Router)();
router.post("/create-update-cart", (0, authorization_1.userAuthorization)(["buyer"]), (0, validation_1.validation)(cartValidations_1.cartSchema), validation_1.isProductIdExist, cartControllers.buyerCreateUpdateCart);
router.get("/buyer-get-carts", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartExist, cartControllers.buyerGetCarts);
router.get("/buyer-get-cart/:cartId", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartIdExist, cartControllers.buyerGetCart);
router.delete("/buyer-clear-cart-product/:cartId/:productId", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartIdExist, validation_1.isCartProductExist, cartControllers.buyerClearCartProduct);
router.delete("/buyer-clear-cart/:cartId", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartIdExist, cartControllers.buyerClearCart);
router.delete("/buyer-clear-carts", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartExist, cartControllers.buyerClearCarts);
router.get("/buyer-cart-checkout/:cartId", (0, authorization_1.userAuthorization)(["buyer"]), validation_1.isCartIdExist, cartControllers.buyerCheckout);
exports.default = router;
//# sourceMappingURL=cartRouter.js.map