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
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable comma-dangle */
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const sinon_1 = __importDefault(require("sinon"));
const http_status_1 = __importDefault(require("http-status"));
const cartRepositories_1 = __importDefault(require("../repositories/cartRepositories"));
const cartController = __importStar(require("../controller/cartControllers"));
const models_1 = __importDefault(require("../../../databases/models"));
const validation_1 = require("../../../middlewares/validation");
const productRepositories_1 = __importDefault(require("../../product/repositories/productRepositories"));
const cartControllers_1 = require("../controller/cartControllers");
chai_1.default.use(chai_http_1.default);
describe("Buyer Get Cart", () => {
    let req;
    let res;
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        req = {
            user: { id: "user-id" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should return cart details when cart exists", async () => {
        const mockCarts = [{ id: "6ee2addd-5270-4855-969b-1f56608b122b" }];
        const mockCartProducts = [
            {
                quantity: 2,
                products: {
                    id: "6ee2addd-5270-4855-969b-1f56608b122c",
                    name: "Product 1",
                    price: 50,
                    images: ["image1.jpg"],
                },
            },
            {
                quantity: 1,
                products: {
                    id: "6ee2addd-5270-4855-969b-1f56608b122d",
                    name: "Product 2",
                    price: 100,
                    images: ["image2.jpg"],
                },
            },
        ];
        sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves(mockCarts);
        sandbox
            .stub(cartRepositories_1.default, "getCartProductsByCartId")
            .resolves(mockCartProducts);
        await cartController.buyerGetCarts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Buyer's all carts",
            data: [
                {
                    cartId: mockCarts[0].id,
                    products: [
                        {
                            id: "6ee2addd-5270-4855-969b-1f56608b122c",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                        {
                            id: "6ee2addd-5270-4855-969b-1f56608b122d",
                            name: "Product 2",
                            price: 100,
                            image: "image2.jpg",
                            quantity: 1,
                            totalPrice: 100,
                        },
                    ],
                    total: 200,
                },
            ],
        });
    });
    it("should handle errors properly", async () => {
        const error = new Error("Something went wrong");
        sandbox.stub(cartRepositories_1.default, "getCartsByUserId").throws(error);
        await cartController.buyerGetCarts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
});
describe("Cart Repositories", () => {
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("addCart", () => {
        it("should add a new cart", async () => {
            const cartData = { userId: "user-id", status: "pending" };
            const mockCart = { id: "cart-id", ...cartData };
            sandbox.stub(models_1.default.Carts, "create").resolves(mockCart);
            const result = await cartRepositories_1.default.addCart(cartData);
            (0, chai_1.expect)(models_1.default.Carts.create).to.have.been.calledOnceWith(cartData);
            (0, chai_1.expect)(result).to.eql(mockCart);
        });
    });
    describe("updateCartProduct", () => {
        it("should update a cart product", async () => {
            const productId = "product-id";
            const cartProductData = { quantity: 3 };
            sandbox.stub(models_1.default.CartProducts, "update").resolves({});
            await cartRepositories_1.default.updateCartProduct(productId, cartProductData);
            (0, chai_1.expect)(models_1.default.CartProducts.update).to.have.been.calledOnceWith(cartProductData, { where: { id: productId } });
        });
    });
    describe("getShopIdByProductId", () => {
        it("should return the shop ID for a given product ID", async () => {
            const productId = "product-id";
            const mockProduct = { shopId: "shop-id" };
            sandbox.stub(models_1.default.Products, "findOne").resolves(mockProduct);
            const result = await cartRepositories_1.default.getShopIdByProductId(productId);
            (0, chai_1.expect)(models_1.default.Products.findOne).to.have.been.calledOnceWith({
                where: { id: productId },
            });
            (0, chai_1.expect)(result).to.equal(mockProduct.shopId);
        });
    });
    describe("addCartProduct", () => {
        it("should add a new cart product", async () => {
            const cartProductData = {
                cartId: "cart-id",
                productId: "product-id",
                quantity: 3,
            };
            const mockCartProduct = { id: "cart-product-id", ...cartProductData };
            sandbox.stub(models_1.default.CartProducts, "create").resolves(mockCartProduct);
            const result = await cartRepositories_1.default.addCartProduct(cartProductData);
            (0, chai_1.expect)(models_1.default.CartProducts.create).to.have.been.calledOnceWith(cartProductData);
            (0, chai_1.expect)(result).to.eql(mockCartProduct);
        });
    });
});
describe("Validation Middlewares", () => {
    let req;
    let res;
    let next;
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        req = {
            user: { id: "6ee2addd-5270-4855-969b-1f56608b122e" },
            body: { productId: "6ee2addd-5270-4855-969b-1f56608b122c" },
            params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        next = sinon_1.default.stub();
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should check if cart exists", async () => {
        sandbox
            .stub(cartRepositories_1.default, "getCartsByUserId")
            .resolves([{ id: "cart-id" }]);
        await (0, validation_1.isCartExist)(req, res, next);
        (0, chai_1.expect)(next).to.have.been.calledOnce;
    });
    it("should check if product ID exists", async () => {
        sandbox
            .stub(productRepositories_1.default, "findProductById")
            .resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1228" });
        await (0, validation_1.isProductIdExist)(req, res, next);
        (0, chai_1.expect)(next).to.have.been.calledOnce;
    });
    it("should return 404 if product ID does not exist", async () => {
        sandbox.stub(productRepositories_1.default, "findProductById").resolves(null);
        await (0, validation_1.isProductIdExist)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.NOT_FOUND,
            message: "No product with that ID.",
        });
    });
    it("should check if cart ID exists", async () => {
        sandbox
            .stub(cartRepositories_1.default, "getCartByUserIdAndCartId")
            .resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1229" });
        await (0, validation_1.isCartIdExist)(req, res, next);
        (0, chai_1.expect)(next).to.have.been.calledOnce;
    });
    it("should return 404 if cart ID does not exist", async () => {
        sandbox.stub(cartRepositories_1.default, "getCartByUserIdAndCartId").resolves(null);
        await (0, validation_1.isCartIdExist)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.NOT_FOUND,
            message: "Cart not found. Please add items to your cart.",
        });
    });
});
describe("Cart Controller - GetCart", () => {
    let req;
    let res;
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        req = {
            user: { id: "6ee2addd-5270-4855-969b-1f56608b122e" },
            body: { productId: "6ee2addd-5270-4855-969b-1f56608b1228", quantity: 2 },
            params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should get cart details", async () => {
        const mockCart = { id: "cart-id" };
        const mockCartProducts = [
            {
                quantity: 2,
                products: {
                    id: "product-id-1",
                    name: "Product 1",
                    price: 50,
                    images: ["image1.jpg"],
                },
            },
            {
                quantity: 1,
                products: {
                    id: "product-id-2",
                    name: "Product 2",
                    price: 100,
                    images: ["image2.jpg"],
                },
            },
        ];
        sandbox
            .stub(cartRepositories_1.default, "getCartByUserIdAndCartId")
            .resolves(mockCart);
        sandbox
            .stub(cartRepositories_1.default, "getCartProductsByCartId")
            .resolves(mockCartProducts);
        await cartController.buyerGetCart(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Cart details",
            data: {
                cartId: mockCart.id,
                products: [
                    {
                        id: "product-id-1",
                        name: "Product 1",
                        price: 50,
                        image: "image1.jpg",
                        quantity: 2,
                        totalPrice: 100,
                    },
                    {
                        id: "product-id-2",
                        name: "Product 2",
                        price: 100,
                        image: "image2.jpg",
                        quantity: 1,
                        totalPrice: 100,
                    },
                ],
                total: 200,
            },
        });
    });
    it("should handle errors in getting cart details", async () => {
        const error = new Error("Something went wrong");
        sandbox.stub(cartRepositories_1.default, "getCartByUserIdAndCartId").throws(error);
        await cartController.buyerGetCart(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
    it("should get all carts for a buyer", async () => {
        const mockCart = { id: "cart-id" };
        const mockCartProducts = [
            {
                quantity: 2,
                products: {
                    id: "product-id-1",
                    name: "Product 1",
                    price: 50,
                    images: ["image1.jpg"],
                },
            },
            {
                quantity: 1,
                products: {
                    id: "product-id-2",
                    name: "Product 2",
                    price: 100,
                    images: ["image2.jpg"],
                },
            },
        ];
        sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves([mockCart]);
        sandbox
            .stub(cartRepositories_1.default, "getCartProductsByCartId")
            .resolves(mockCartProducts);
        await cartController.buyerGetCarts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Buyer's all carts",
            data: [
                {
                    cartId: "cart-id",
                    products: [
                        {
                            id: "product-id-1",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                        {
                            id: "product-id-2",
                            name: "Product 2",
                            price: 100,
                            image: "image2.jpg",
                            quantity: 1,
                            totalPrice: 100,
                        },
                    ],
                    total: 200,
                },
            ],
        });
    });
    it("should handle errors in getting all carts", async () => {
        const error = new Error("Something went wrong");
        sandbox.stub(cartRepositories_1.default, "getCartsByUserId").throws(error);
        await cartController.buyerGetCarts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
    it("should get all carts for a buyer", async () => {
        const mockCart = { id: "cart-id" };
        const mockCartProducts = [
            {
                quantity: 2,
                products: {
                    id: "product-id-1",
                    name: "Product 1",
                    price: 50,
                    images: ["image1.jpg"],
                },
            },
            {
                quantity: 1,
                products: {
                    id: "product-id-2",
                    name: "Product 2",
                    price: 100,
                    images: ["image2.jpg"],
                },
            },
        ];
        sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves([mockCart]);
        sandbox
            .stub(cartRepositories_1.default, "getCartProductsByCartId")
            .resolves(mockCartProducts);
        await cartController.buyerGetCarts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Buyer's all carts",
            data: [
                {
                    cartId: mockCart.id,
                    products: [
                        {
                            id: "product-id-1",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                        {
                            id: "product-id-2",
                            name: "Product 2",
                            price: 100,
                            image: "image2.jpg",
                            quantity: 1,
                            totalPrice: 100,
                        },
                    ],
                    total: 200,
                },
            ],
        });
    });
    it("should get cart details for a specific cart ID", async () => {
        const mockCart = { id: "cart-id" };
        const mockCartProducts = [
            {
                quantity: 2,
                products: {
                    id: "product-id-1",
                    name: "Product 1",
                    price: 50,
                    images: ["image1.jpg"],
                },
            },
            {
                quantity: 1,
                products: {
                    id: "product-id-2",
                    name: "Product 2",
                    price: 100,
                    images: ["image2.jpg"],
                },
            },
        ];
        sandbox
            .stub(cartRepositories_1.default, "getCartByUserIdAndCartId")
            .resolves(mockCart);
        sandbox
            .stub(cartRepositories_1.default, "getCartProductsByCartId")
            .resolves(mockCartProducts);
        await cartController.buyerGetCart(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Cart details",
            data: {
                cartId: mockCart.id,
                products: [
                    {
                        id: "product-id-1",
                        name: "Product 1",
                        price: 50,
                        image: "image1.jpg",
                        quantity: 2,
                        totalPrice: 100,
                    },
                    {
                        id: "product-id-2",
                        name: "Product 2",
                        price: 100,
                        image: "image2.jpg",
                        quantity: 1,
                        totalPrice: 100,
                    },
                ],
                total: 200,
            },
        });
    });
});
describe("Cart Controller Tests", () => {
    let req;
    let res;
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        req = {
            user: { id: "user-id" },
            body: { productId: "product-id", quantity: 2 },
            params: { cartId: "cart-id" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe("buyerCreateUpdateCart", () => {
        it("should update cart product if already exist", async () => {
            const mockCart = { id: "cart-id", userId: "user-id", status: "pending" };
            const mockProduct = {
                id: "product-id",
                name: "Product 1",
                price: 50,
                images: ["image1.jpg"],
                shopId: "shop-id",
            };
            const mockCartProducts = [
                {
                    quantity: 2,
                    products: {
                        id: "product-id",
                        name: "Product 1",
                        price: 50,
                        images: ["image1.jpg"],
                    },
                },
            ];
            sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves([mockCart]);
            sandbox
                .stub(cartRepositories_1.default, "getCartProductsByCartId")
                .resolves(mockCartProducts);
            sandbox
                .stub(productRepositories_1.default, "findProductById")
                .resolves(mockProduct);
            sandbox.stub(cartRepositories_1.default, "addCartProduct").resolves();
            sandbox.stub(cartRepositories_1.default, "updateCartProduct").resolves();
            await cartController.buyerCreateUpdateCart(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "Cart quantity updated successfully",
                data: {
                    cartId: undefined,
                    products: [
                        {
                            id: "product-id",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                    ],
                    total: 100,
                },
            });
        });
        it("should add product to existing cart if cart exists", async () => {
            const mockCart = { id: "cart-id", userId: "user-id", status: "pending" };
            const mockProduct = {
                id: "product-id",
                name: "Product 1",
                price: 50,
                images: ["image1.jpg"],
                shopId: "shop-id",
            };
            const mockCartProducts = [
                {
                    quantity: 2,
                    products: {
                        id: "product-id-2",
                        name: "Product 1",
                        price: 50,
                        images: ["image1.jpg"],
                        shopId: "shop-id",
                    },
                },
            ];
            sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves([mockCart]);
            sandbox
                .stub(cartRepositories_1.default, "getCartProductsByCartId")
                .resolves(mockCartProducts);
            sandbox
                .stub(productRepositories_1.default, "findProductById")
                .resolves(mockProduct);
            sandbox.stub(cartRepositories_1.default, "addCartProduct").resolves();
            sandbox.stub(cartRepositories_1.default, "updateCartProduct").resolves();
            await cartController.buyerCreateUpdateCart(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "Product added to existing Cart",
                data: {
                    cartId: "cart-id",
                    products: [
                        {
                            id: "product-id-2",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                    ],
                    total: 100,
                },
            });
        });
        it("should create new cart and add product if no cart exists", async () => {
            const mockCreatedCart = {
                id: "new-cart-id",
                userId: "user-id",
                status: "pending",
            };
            const mockProduct = {
                id: "product-id",
                name: "Product 1",
                price: 50,
                images: ["image1.jpg"],
                shopId: "shop-id",
            };
            const mockCartProducts = [
                {
                    quantity: 2,
                    products: {
                        id: "product-id",
                        name: "Product 1",
                        price: 50,
                        images: ["image1.jpg"],
                    },
                },
            ];
            sandbox.stub(cartRepositories_1.default, "getCartsByUserId").resolves([]);
            sandbox.stub(cartRepositories_1.default, "addCart").resolves(mockCreatedCart);
            sandbox
                .stub(productRepositories_1.default, "findProductById")
                .resolves(mockProduct);
            sandbox.stub(cartRepositories_1.default, "addCartProduct").resolves();
            sandbox
                .stub(cartRepositories_1.default, "getCartProductsByCartId")
                .resolves(mockCartProducts);
            await cartController.buyerCreateUpdateCart(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.CREATED);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "Cart added successfully",
                data: {
                    cartId: "new-cart-id",
                    products: [
                        {
                            id: "product-id",
                            name: "Product 1",
                            price: 50,
                            image: "image1.jpg",
                            quantity: 2,
                            totalPrice: 100,
                        },
                    ],
                    total: 100,
                },
            });
        });
        it("should handle errors properly", async () => {
            const error = new Error("Something went wrong");
            sandbox.stub(cartRepositories_1.default, "getCartsByUserId").throws(error);
            await cartController.buyerCreateUpdateCart(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                error: error.message,
            });
        });
    });
});
describe("buyerClearCartProduct", () => {
    let req, res, deleteCartProductStub;
    beforeEach(() => {
        req = {
            cart: { id: "cartId" },
            product: { productId: "productId" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub(),
        };
        deleteCartProductStub = sinon_1.default.stub(cartRepositories_1.default, "deleteCartProduct");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should clear the cart product successfully", async () => {
        deleteCartProductStub.resolves();
        await (0, cartControllers_1.buyerClearCartProduct)(req, res);
        (0, chai_1.expect)(deleteCartProductStub).to.have.been.calledWith("cartId", "productId");
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Cart product cleared successfully",
        });
    });
    it("should handle errors and respond with an error message", async () => {
        const errorMessage = "Internal Server Error";
        deleteCartProductStub.rejects(new Error(errorMessage));
        await (0, cartControllers_1.buyerClearCartProduct)(req, res);
        (0, chai_1.expect)(deleteCartProductStub).to.have.been.calledWith("cartId", "productId");
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: errorMessage,
        });
    });
});
describe("buyerClearCart", () => {
    let req, res, deleteAllCartProductsStub, deleteCartByIdStub;
    beforeEach(() => {
        req = {
            cart: { id: "cartId" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub(),
        };
        deleteAllCartProductsStub = sinon_1.default.stub(cartRepositories_1.default, "deleteAllCartProducts");
        deleteCartByIdStub = sinon_1.default.stub(cartRepositories_1.default, "deleteCartById");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should clear all products in the cart and the cart itself successfully", async () => {
        deleteAllCartProductsStub.resolves();
        deleteCartByIdStub.resolves();
        await (0, cartControllers_1.buyerClearCart)(req, res);
        (0, chai_1.expect)(deleteAllCartProductsStub).to.have.been.calledWith("cartId");
        (0, chai_1.expect)(deleteCartByIdStub).to.have.been.calledWith("cartId");
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "All products in cart cleared successfully!",
        });
    });
    it("should handle errors and respond with an error message", async () => {
        const errorMessage = "Internal Server Error";
        deleteAllCartProductsStub.rejects(new Error(errorMessage));
        await (0, cartControllers_1.buyerClearCart)(req, res);
        (0, chai_1.expect)(deleteAllCartProductsStub).to.have.been.calledWith("cartId");
        (0, chai_1.expect)(deleteCartByIdStub).not.to.have.been.called;
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: errorMessage,
        });
    });
});
describe("buyerClearCarts", () => {
    let req, res, deleteAllCartProductsStub, deleteAllUserCartsStub;
    beforeEach(() => {
        req = {
            carts: [{ id: 1 }, { id: 2 }],
            user: { id: 1 },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub(),
        };
        deleteAllCartProductsStub = sinon_1.default
            .stub(cartRepositories_1.default, "deleteAllCartProducts")
            .resolves();
        deleteAllUserCartsStub = sinon_1.default
            .stub(cartRepositories_1.default, "deleteAllUserCarts")
            .resolves();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should clear all carts and return success message", async () => {
        await (0, cartControllers_1.buyerClearCarts)(req, res);
        (0, chai_1.expect)(deleteAllCartProductsStub.calledTwice).to.be.true;
        (0, chai_1.expect)(deleteAllCartProductsStub.firstCall.calledWith(1)).to.be.true;
        (0, chai_1.expect)(deleteAllCartProductsStub.secondCall.calledWith(2)).to.be.true;
        (0, chai_1.expect)(deleteAllUserCartsStub.calledOnceWith(1)).to.be.true;
        (0, chai_1.expect)(res.status.calledOnceWith(http_status_1.default.OK)).to.be.true;
        (0, chai_1.expect)(res.json.calledOnceWith({ message: "All carts cleared successfully!" })).to.be.true;
    });
    it("should handle errors and return internal server error message", async () => {
        const errorMessage = "Something went wrong";
        deleteAllCartProductsStub.rejects(new Error(errorMessage));
        await (0, cartControllers_1.buyerClearCarts)(req, res);
        (0, chai_1.expect)(res.status.calledOnceWith(http_status_1.default.INTERNAL_SERVER_ERROR)).to.be
            .true;
        (0, chai_1.expect)(res.json.calledOnceWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: errorMessage,
        })).to.be.true;
    });
});
//# sourceMappingURL=cart.spec.js.map