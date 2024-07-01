/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable comma-dangle */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import * as cartController from "../controller/cartControllers";
import db from "../../../databases/models";
import app from "../../..";
import {
  isCartExist,
  isCartIdExist,
  isProductIdExist,
  isOrderExist
} from "../../../middlewares/validation";
import productRepositories from "../../product/repositories/productRepositories";
import {
  buyerClearCart,
  buyerClearCarts,
  buyerClearCartProduct,
} from "../controller/cartControllers";
import EventEmitter = require("events");

chai.use(chaiHttp);
const router = () => chai.request(app);
describe("Buyer Get Cart", () => {
  let req;
  let res;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "user-id" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
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

    sandbox.stub(cartRepositories, "getCartsByUserId").resolves(mockCarts);
    sandbox
      .stub(cartRepositories, "getCartProductsByCartId")
      .resolves(mockCartProducts);

    await cartController.buyerGetCarts(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
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
    sandbox.stub(cartRepositories, "getCartsByUserId").throws(error);
    await cartController.buyerGetCarts(req, res);
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  });
});

describe("Cart Repositories", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("addCart", () => {
    it("should add a new cart", async () => {
      const cartData = { userId: "user-id", status: "pending" };
      const mockCart = { id: "cart-id", ...cartData };
      sandbox.stub(db.Carts, "create").resolves(mockCart);

      const result = await cartRepositories.addCart(cartData);

      expect(db.Carts.create).to.have.been.calledOnceWith(cartData);
      expect(result).to.eql(mockCart);
    });
  });

  describe("updateCartProduct", () => {
    it("should update a cart product", async () => {
      const productId = "product-id";
      const cartProductData = { quantity: 3 };
      sandbox.stub(db.CartProducts, "update").resolves({});

      await cartRepositories.updateCartProduct(productId, cartProductData);

      expect(db.CartProducts.update).to.have.been.calledOnceWith(
        cartProductData,
        { where: { id: productId } }
      );
    });
  });

  describe("getShopIdByProductId", () => {
    it("should return the shop ID for a given product ID", async () => {
      const productId = "product-id";
      const mockProduct = { shopId: "shop-id" };
      sandbox.stub(db.Products, "findOne").resolves(mockProduct);

      const result = await cartRepositories.getShopIdByProductId(productId);

      expect(db.Products.findOne).to.have.been.calledOnceWith({
        where: { id: productId },
      });
      expect(result).to.equal(mockProduct.shopId);
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
      sandbox.stub(db.CartProducts, "create").resolves(mockCartProduct);

      const result = await cartRepositories.addCartProduct(cartProductData);

      expect(db.CartProducts.create).to.have.been.calledOnceWith(
        cartProductData
      );
      expect(result).to.eql(mockCartProduct);
    });
  });
});

describe("Validation Middlewares", () => {
  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "6ee2addd-5270-4855-969b-1f56608b122e" },
      body: { productId: "6ee2addd-5270-4855-969b-1f56608b122c" },
      params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should check if cart exists", async () => {
    sandbox
      .stub(cartRepositories, "getCartsByUserId")
      .resolves([{ id: "cart-id" }]);

    await isCartExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should check if product ID exists", async () => {
    sandbox
      .stub(productRepositories, "findProductById")
      .resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1228" });

    await isProductIdExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if product ID does not exist", async () => {
    sandbox.stub(productRepositories, "findProductById").resolves(null);

    await isProductIdExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "No product with that ID.",
    });
  });

  it("should check if cart ID exists", async () => {
    sandbox
      .stub(cartRepositories, "getCartByUserIdAndCartId")
      .resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1229" });

    await isCartIdExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if cart ID does not exist", async () => {
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").resolves(null);

    await isCartIdExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "Cart not found. Please add items to your cart.",
    });
  });
});

describe("Cart Controller - GetCart", () => {
  let req;
  let res;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "6ee2addd-5270-4855-969b-1f56608b122e" },
      body: { productId: "6ee2addd-5270-4855-969b-1f56608b1228", quantity: 2 },
      params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
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
      .stub(cartRepositories, "getCartByUserIdAndCartId")
      .resolves(mockCart);
    sandbox
      .stub(cartRepositories, "getCartProductsByCartId")
      .resolves(mockCartProducts);

    await cartController.buyerGetCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
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
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").throws(error);

    await cartController.buyerGetCart(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
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
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
    sandbox
      .stub(cartRepositories, "getCartProductsByCartId")
      .resolves(mockCartProducts);

    await cartController.buyerGetCarts(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
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
    sandbox.stub(cartRepositories, "getCartsByUserId").throws(error);

    await cartController.buyerGetCarts(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
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

    sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
    sandbox
      .stub(cartRepositories, "getCartProductsByCartId")
      .resolves(mockCartProducts);

    await cartController.buyerGetCarts(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
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
      .stub(cartRepositories, "getCartByUserIdAndCartId")
      .resolves(mockCart);
    sandbox
      .stub(cartRepositories, "getCartProductsByCartId")
      .resolves(mockCartProducts);

    await cartController.buyerGetCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
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
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "user-id" },
      body: { productId: "product-id", quantity: 2 },
      params: { cartId: "cart-id" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
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

      sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
      sandbox
        .stub(cartRepositories, "getCartProductsByCartId")
        .resolves(mockCartProducts);
      sandbox
        .stub(productRepositories, "findProductById")
        .resolves(mockProduct);
      sandbox.stub(cartRepositories, "addCartProduct").resolves();
      sandbox.stub(cartRepositories, "updateCartProduct").resolves();

      await cartController.buyerCreateUpdateCart(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.OK);
      expect(res.json).to.have.been.calledWith({
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

      sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
      sandbox
        .stub(cartRepositories, "getCartProductsByCartId")
        .resolves(mockCartProducts);
      sandbox
        .stub(productRepositories, "findProductById")
        .resolves(mockProduct);
      sandbox.stub(cartRepositories, "addCartProduct").resolves();
      sandbox.stub(cartRepositories, "updateCartProduct").resolves();

      await cartController.buyerCreateUpdateCart(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.OK);
      expect(res.json).to.have.been.calledWith({
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

      sandbox.stub(cartRepositories, "getCartsByUserId").resolves([]);
      sandbox.stub(cartRepositories, "addCart").resolves(mockCreatedCart);
      sandbox
        .stub(productRepositories, "findProductById")
        .resolves(mockProduct);
      sandbox.stub(cartRepositories, "addCartProduct").resolves();
      sandbox
        .stub(cartRepositories, "getCartProductsByCartId")
        .resolves(mockCartProducts);

      await cartController.buyerCreateUpdateCart(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.CREATED);
      expect(res.json).to.have.been.calledWith({
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
      sandbox.stub(cartRepositories, "getCartsByUserId").throws(error);

      await cartController.buyerCreateUpdateCart(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
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
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    deleteCartProductStub = sinon.stub(cartRepositories, "deleteCartProduct");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should clear the cart product successfully", async () => {
    deleteCartProductStub.resolves();

    await buyerClearCartProduct(req, res);

    expect(deleteCartProductStub).to.have.been.calledWith(
      "cartId",
      "productId"
    );
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Cart product cleared successfully",
    });
  });

  it("should handle errors and respond with an error message", async () => {
    const errorMessage = "Internal Server Error";
    deleteCartProductStub.rejects(new Error(errorMessage));

    await buyerClearCartProduct(req, res);

    expect(deleteCartProductStub).to.have.been.calledWith(
      "cartId",
      "productId"
    );
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
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
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    deleteAllCartProductsStub = sinon.stub(
      cartRepositories,
      "deleteAllCartProducts"
    );
    deleteCartByIdStub = sinon.stub(cartRepositories, "deleteCartById");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should clear all products in the cart and the cart itself successfully", async () => {
    deleteAllCartProductsStub.resolves();
    deleteCartByIdStub.resolves();

    await buyerClearCart(req, res);

    expect(deleteAllCartProductsStub).to.have.been.calledWith("cartId");
    expect(deleteCartByIdStub).to.have.been.calledWith("cartId");
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "All products in cart cleared successfully!",
    });
  });

  it("should handle errors and respond with an error message", async () => {
    const errorMessage = "Internal Server Error";
    deleteAllCartProductsStub.rejects(new Error(errorMessage));

    await buyerClearCart(req, res);

    expect(deleteAllCartProductsStub).to.have.been.calledWith("cartId");
    expect(deleteCartByIdStub).not.to.have.been.called;
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
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
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    deleteAllCartProductsStub = sinon
      .stub(cartRepositories, "deleteAllCartProducts")
      .resolves();
    deleteAllUserCartsStub = sinon
      .stub(cartRepositories, "deleteAllUserCarts")
      .resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should clear all carts and return success message", async () => {
    await buyerClearCarts(req, res);

    expect(deleteAllCartProductsStub.calledTwice).to.be.true;
    expect(deleteAllCartProductsStub.firstCall.calledWith(1)).to.be.true;
    expect(deleteAllCartProductsStub.secondCall.calledWith(2)).to.be.true;
    expect(deleteAllUserCartsStub.calledOnceWith(1)).to.be.true;

    expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
    expect(
      res.json.calledOnceWith({ message: "All carts cleared successfully!" })
    ).to.be.true;
  });

  it("should handle errors and return internal server error message", async () => {
    const errorMessage = "Something went wrong";
    deleteAllCartProductsStub.rejects(new Error(errorMessage));

    await buyerClearCarts(req, res);

    expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be
      .true;
    expect(
      res.json.calledOnceWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      })
    ).to.be.true;
  });
});

describe("isOrderExist Middleware", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: {},
      params: { id: 'order-id' },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should find the order for a buyer", async () => {
    req.user.role = "buyer";
    req.user.id = "user-id";
    const mockOrder = { id: "order-id" };
    sandbox.stub(cartRepositories, "getOrderByOrderIdAndUserId").resolves(mockOrder);

    await isOrderExist(req, res, next);

    expect(req.order).to.equal(mockOrder);
    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if order is not found for a buyer", async () => {
    req.user.role = "buyer";
    req.user.id = "user-id";
    sandbox.stub(cartRepositories, "getOrderByOrderIdAndUserId").resolves(null);

    await isOrderExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      error: "order Not Found",
    });
    expect(next).not.to.have.been.called;
  });

  it("should find the order for an admin", async () => {
    req.user.role = "admin";
    const mockOrder = { id: "order-id" };
    sandbox.stub(cartRepositories, "getOrderById").resolves(mockOrder);

    await isOrderExist(req, res, next);

    expect(req.order).to.equal(mockOrder);
    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if order is not found for an admin", async () => {
    req.user.role = "admin";
    sandbox.stub(cartRepositories, "getOrderById").resolves(null);

    await isOrderExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      error: "order Not Found",
    });
    expect(next).not.to.have.been.called;
  });

  it("should return 500 if there is a server error", async () => {
    req.user.role = "buyer";
    req.user.id = "user-id";
    sandbox.stub(cartRepositories, "getOrderByOrderIdAndUserId").throws(new Error("Database error"));

    await isOrderExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      er: "Database error",
    });
    expect(next).not.to.have.been.called;
  });
});

describe("getOrderByOrderIdAndUserId", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return the order if found", async () => {
    const mockOrder = { id: "order-id", carts: [{ userId: "user-id" }] };
    sandbox.stub(db.Orders, "findOne").resolves(mockOrder);

    const order = await cartRepositories.getOrderByOrderIdAndUserId("order-id", "user-id");

    expect(order).to.equal(mockOrder);
    expect(db.Orders.findOne).to.have.been.calledOnceWith({
      where: { id: "order-id" },
      include: [
        {
          model: db.Carts,
          as: "carts",
          where: { userId: "user-id" }
        }
      ]
    });
  });

  it("should return null if order is not found", async () => {
    sandbox.stub(db.Orders, "findOne").resolves(null);

    const order = await cartRepositories.getOrderByOrderIdAndUserId("order-id", "user-id");

    expect(order).to.be.null;
    expect(db.Orders.findOne).to.have.been.calledOnceWith({
      where: { id: "order-id" },
      include: [
        {
          model: db.Carts,
          as: "carts",
          where: { userId: "user-id" }
        }
      ]
    });
  });

  it("should throw an error if there is a database error", async () => {
    const errorMessage = "Database error";
    sandbox.stub(db.Orders, "findOne").throws(new Error(errorMessage));

    try {
      await cartRepositories.getOrderByOrderIdAndUserId("order-id", "user-id");
      throw new Error("Expected getOrderByOrderIdAndUserId to throw an error");
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
  });
});

describe("buyerGetOrderStatus", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      order: { id: "order-id" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return the order status", async () => {
    await cartController.buyerGetOrderStatus(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Order Status found successfully",
      data: {
        order: req.order
      }
    });
  });
});

describe("getOrderById", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return the order if found", async () => {
    const mockOrder = { id: "order-id" };
    sandbox.stub(db.Orders, "findOne").resolves(mockOrder);

    const order = await cartRepositories.getOrderById("order-id");

    expect(order).to.equal(mockOrder);
    expect(db.Orders.findOne).to.have.been.calledOnceWith({ where: { id: "order-id" } });
  });

  it("should return null if order is not found", async () => {
    sandbox.stub(db.Orders, "findOne").resolves(null);

    const order = await cartRepositories.getOrderById("order-id");

    expect(order).to.be.null;
    expect(db.Orders.findOne).to.have.been.calledOnceWith({ where: { id: "order-id" } });
  });

  it("should throw an error if there is a database error", async () => {
    const errorMessage = "Database error";
    sandbox.stub(db.Orders, "findOne").throws(new Error(errorMessage));

    try {
      await cartRepositories.getOrderById("order-id");
      throw new Error("Expected getOrderById to throw an error");
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
  });
});

describe("updateOrderStatus", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should update the order status", async () => {
    const mockUpdateResult = [1]; 
    sandbox.stub(db.Orders, "update").resolves(mockUpdateResult);

    const result = await cartRepositories.updateOrderStatus("order-id", "completed");

    expect(result).to.equal(mockUpdateResult);
    expect(db.Orders.update).to.have.been.calledOnceWith(
      { status: "completed" },
      { where: { id: "order-id" } }
    );
  });

  it("should return an array with 0 if no rows were affected", async () => {
    const mockUpdateResult = [0];
    sandbox.stub(db.Orders, "update").resolves(mockUpdateResult);

    const result = await cartRepositories.updateOrderStatus("order-id", "completed");

    expect(result).to.equal(mockUpdateResult);
    expect(db.Orders.update).to.have.been.calledOnceWith(
      { status: "completed" },
      { where: { id: "order-id" } }
    );
  });

  it("should throw an error if there is a database error", async () => {
    const errorMessage = "Database error";
    sandbox.stub(db.Orders, "update").throws(new Error(errorMessage));

    try {
      await cartRepositories.updateOrderStatus("order-id", "completed");
      throw new Error("Expected updateOrderStatus to throw an error");
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }
  });
});

describe("adminUpdateOrderStatus", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { id: "order-id" },
      body: { status: "completed" },
      order: { id: "order-id" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should update order status", async () => {
    const mockUpdateStatus = [1]; 
    sandbox.stub(cartRepositories, "updateOrderStatus").resolves(mockUpdateStatus);

    await cartController.adminUpdateOrderStatus(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Status updated successfully!",
      data: { order: req.order }
    });
  });
});

describe("adminUpdateOrderStatus", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { id: "order-id" },
      body: { status: "completed" },
      order: { id: "order-id" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should handle errors", async () => {
    const errorMessage = "An error occurred";
    sandbox.stub(cartRepositories, "updateOrderStatus").throws(new Error(errorMessage));

    await cartController.adminUpdateOrderStatus(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage
    });
  });
});