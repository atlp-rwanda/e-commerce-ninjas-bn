/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import * as cartController from "../controller/cartControllers";
import db from "../../../databases/models";
import app from "../../..";
import Stripe from 'stripe';
import { checkout } from '../controller/cartControllers';
import { Response } from 'express';
import { ExtendRequest } from "../../../types";

import {
  isCartExist,
  isCartIdExist,
  isProductIdExist,
  isCartProductExist,
} from "../../../middlewares/validation";
import productRepositories from "../../product/repositories/productRepositories";
import {
  buyerClearCart,
  buyerClearCarts,
  buyerClearCartProduct,
} from "../controller/cartControllers";

chai.use(chaiHttp);
const router = () => chai.request(app);

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



describe('Middleware Functions', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      params: {},
      cart: {},
      product: null
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('isCartProductExist', () => {
    it('should return 404 if product does not exist in cart', async () => {
      const cartId = 'testCartId';
      const productId = 'testProductId';

      req.cart.id = cartId;
      req.params.productId = productId;

      sinon.stub(cartRepositories, 'getProductByCartIdAndProductId').resolves(null);

      await isCartProductExist(req, res , next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.NOT_FOUND,
        message: 'Product not found.'
      });
      expect(next).to.not.have.been.called;
    });

    it('should set req.product and call next if product exists in cart', async () => {
      const cartId = 'testCartId';
      const productId = 'testProductId';
      const product = { id: 'product1' };

      req.cart.id = cartId;
      req.params.productId = productId;

      sinon.stub(cartRepositories, 'getProductByCartIdAndProductId').resolves(product as any);

      await isCartProductExist(req, res , next);

      expect(req.product).to.equal(product);
      expect(next).to.have.been.called;
    });

    it('should handle errors and return 500 status', async () => {
      const errorMessage = 'Internal server error';

      sinon.stub(cartRepositories, 'getProductByCartIdAndProductId').rejects(new Error(errorMessage));

      await isCartProductExist(req, res , next);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage
      });
      expect(next).to.not.have.been.called;
    });
  });
});



describe('Cart Controllers - Checkout', () => {
  let req: ExtendRequest;
  let res
  let stripeStub: sinon.SinonStub;
  let findCartIdbyUserIdStub: sinon.SinonStub;
  let findCartProductByCartIdStub: sinon.SinonStub;
  let findProductByIdStub: sinon.SinonStub;

  const stripe = new Stripe(process.env.STRIPE_SECRET);

  beforeEach(() => {
    req = {
      user: { id: 'user-id' }
    } as ExtendRequest;

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    } as unknown as Response;

    findCartIdbyUserIdStub = sinon.stub(cartRepositories, 'findCartIdbyUserId');
    findCartProductByCartIdStub = sinon.stub(cartRepositories, 'findCartProductByCartId');
    findProductByIdStub = sinon.stub(cartRepositories, 'findProductById');
    stripeStub = sinon.stub(stripe.checkout.sessions, 'create');
  });

  afterEach(() => {
    findCartIdbyUserIdStub.restore();
    findCartProductByCartIdStub.restore();
    findProductByIdStub.restore();
    stripeStub.restore();
  });

  it('should handle errors', async () => {
    const error = new Error('Something went wrong');
    findCartIdbyUserIdStub.rejects(error);

    await checkout(req, res);

    expect(res.status).to.have.been.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledOnceWith({ message: error.message });
  });
});
