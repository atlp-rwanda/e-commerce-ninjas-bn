"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerCheckout = exports.buyerClearCartProduct = exports.buyerCreateUpdateCart = exports.buyerClearCarts = exports.buyerClearCart = exports.buyerGetCarts = exports.buyerGetCart = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cartRepositories_1 = __importDefault(require("../repositories/cartRepositories"));
const productRepositories_1 = __importDefault(require("../../product/repositories/productRepositories"));
const enums_1 = require("../../../enums");
const getProductDetails = (cartProducts) => {
    let cartTotal = 0;
    const productsDetails = cartProducts.map((cartProduct) => {
        const product = cartProduct.products;
        const totalPrice = cartProduct.quantity * product.price;
        cartTotal += totalPrice;
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: cartProduct.quantity,
            totalPrice: totalPrice,
        };
    });
    return { productsDetails, cartTotal };
};
const buyerGetCart = async (req, res) => {
    try {
        const cart = await cartRepositories_1.default.getCartByUserIdAndCartId(req.user.id, req.params.cartId);
        const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cart.id);
        const { productsDetails, cartTotal } = getProductDetails(cartProducts);
        return res.status(http_status_1.default.OK).json({
            message: "Cart details",
            data: {
                cartId: cart.id,
                products: productsDetails,
                total: cartTotal,
            },
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    }
};
exports.buyerGetCart = buyerGetCart;
const buyerGetCarts = async (req, res) => {
    try {
        const carts = await cartRepositories_1.default.getCartsByUserId(req.user.id);
        const allCartsDetails = await Promise.all(carts.map(async (cart) => {
            const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cart.id);
            const { productsDetails, cartTotal } = getProductDetails(cartProducts);
            return {
                cartId: cart.id,
                products: productsDetails,
                total: cartTotal,
            };
        }));
        return res.status(http_status_1.default.OK).json({
            message: "Buyer's all carts",
            data: allCartsDetails,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    }
};
exports.buyerGetCarts = buyerGetCarts;
const addProductToExistingCart = async (cart, product, quantity, res) => {
    await cartRepositories_1.default.addCartProduct({
        cartId: cart.id,
        productId: product.id,
        quantity,
        price: product.price,
        discount: product.discount,
        totalPrice: product.price * quantity,
    });
    const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cart.id);
    const { productsDetails, cartTotal } = getProductDetails(cartProducts);
    return res.status(http_status_1.default.OK).json({
        message: "Product added to existing Cart",
        data: {
            cartId: cart.id,
            products: productsDetails,
            total: cartTotal,
        },
    });
};
const updateCartProduct = async (cartProduct, quantity, res) => {
    await cartRepositories_1.default.updateCartProduct(cartProduct.id, {
        quantity,
        totalPrice: cartProduct.products.price * quantity,
    });
    const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cartProduct.cartId);
    const { productsDetails, cartTotal } = getProductDetails(cartProducts);
    return res.status(http_status_1.default.OK).json({
        message: "Cart quantity updated successfully",
        data: {
            cartId: cartProduct.cartId,
            products: productsDetails,
            total: cartTotal,
        },
    });
};
const buyerCreateUpdateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const carts = await cartRepositories_1.default.getCartsByUserId(userId);
        for (const cart of carts) {
            const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cart.id);
            for (const cartProduct of cartProducts) {
                const product = cartProduct.products;
                if (product.id === productId) {
                    return updateCartProduct(cartProduct, quantity, res);
                }
            }
        }
        if (carts.length > 0) {
            const productToAdd = await productRepositories_1.default.findProductById(productId);
            for (const cart of carts) {
                const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(cart.id);
                for (const cartProduct of cartProducts) {
                    const product = cartProduct.products;
                    if (product.shopId === productToAdd.shopId) {
                        return addProductToExistingCart(cart, productToAdd, quantity, res);
                    }
                }
            }
        }
        const createdCart = await cartRepositories_1.default.addCart({
            userId,
            status: enums_1.cartStatusEnum.PENDING,
        });
        const product = await productRepositories_1.default.findProductById(productId);
        await cartRepositories_1.default.addCartProduct({
            cartId: createdCart.id,
            productId,
            quantity,
            price: product.price,
            discount: product.discount,
            totalPrice: product.price * quantity,
        });
        const cartProducts = await cartRepositories_1.default.getCartProductsByCartId(createdCart.id);
        const { productsDetails, cartTotal } = getProductDetails(cartProducts);
        res.status(http_status_1.default.CREATED).json({
            message: "Cart added successfully",
            data: {
                cartId: createdCart.id,
                products: productsDetails,
                total: cartTotal,
            },
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    }
};
exports.buyerCreateUpdateCart = buyerCreateUpdateCart;
const buyerClearCartProduct = async (req, res) => {
    try {
        await cartRepositories_1.default.deleteCartProduct(req.cart.id, req.product.productId);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Cart product cleared successfully" });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.buyerClearCartProduct = buyerClearCartProduct;
const buyerClearCart = async (req, res) => {
    try {
        await cartRepositories_1.default.deleteAllCartProducts(req.cart.id);
        await cartRepositories_1.default.deleteCartById(req.cart.id);
        res
            .status(http_status_1.default.OK)
            .json({ message: "All products in cart cleared successfully!" });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.buyerClearCart = buyerClearCart;
const buyerClearCarts = async (req, res) => {
    try {
        for (const cart of req.carts) {
            await cartRepositories_1.default.deleteAllCartProducts(cart.id);
        }
        await cartRepositories_1.default.deleteAllUserCarts(req.user.id);
        res
            .status(http_status_1.default.OK)
            .json({ message: "All carts cleared successfully!" });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.buyerClearCarts = buyerClearCarts;
const buyerCheckout = async (req, res) => {
    try {
        const cart = req.cart;
        let totalAmount = 0;
        cart.cartProducts.forEach(product => {
            totalAmount += product.totalPrice;
        });
        return res.status(http_status_1.default.OK).json({
            status: http_status_1.default.OK,
            data: { totalAmount, cart }
        });
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message
        });
    }
};
exports.buyerCheckout = buyerCheckout;
//# sourceMappingURL=cartControllers.js.map