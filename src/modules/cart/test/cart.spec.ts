/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint quotes: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, {SinonSandbox, SinonStub, mock}  from "sinon";
import stripe, { Stripe } from "stripe";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import * as cartController from "../controller/cartControllers";
import db from "../../../databases/models";
import { paymentCheckoutSchema } from "../validation/cartValidations";
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
import app from "../../..";
import { sendEmailNotification, transporter } from "../../../services/sendEmail";
import authRepositories from "../../auth/repository/authRepositories";

chai.use(chaiHttp);
let token1:string = null;
const router = () => chai.request(app);
let cartId;
let cartId2;
let token2:string = null;
describe("Buyer Get Cart", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should login user to get token", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer@gmail.com",
        password: "Password@123",
      })
      .end((error, response) => {
        console.log('Login Response:', response.body); // Add logging here
        token1 = response.body.data.token;
        done(error);
      });
  });
  
  it("should return cart details when cart exists", (done) => {
    if (!token1) {
      throw new Error("Token is not set");
    }
    router()
      .get("/api/cart/buyer-get-carts")
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        console.log('Cart Details Response:', response.body); // Add logging here
        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("status", httpStatus.OK);
        expect(response.body).to.have.property("message", "Buyer's all carts");
        expect(response.body).to.have.property("data");
        cartId = response.body.data.allCartsDetails[0].cartId;
        done(error);
      });
  });
  

  it("should handle errors properly", (done) => {
    if (!token1) {
      throw new Error("Token is not set");
    }
    sinon.stub(cartRepositories, "getCartsByUserId").throws(new Error("Internal server error"));
    router()
      .get("/api/cart/buyer-get-carts")
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        console.log('Error Handling Response:', response.body);
        expect(response).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.have.property("error", "Internal server error");
        done(error);
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

  it(" buyer should get cart details by cart id ", (done) => {
    router()
      .get(`/api/cart/buyer-get-cart/${cartId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("status", httpStatus.OK);
        expect(response.body).to.have.property("message", "Cart details");
        expect(response.body).to.have.property("data");
        done(error);
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
});
describe(" Cart Controller Tests ", () => {
  let req;
  let res;
  let productId;
  let sandbox;
  let cartId;
  before(async () => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "user-id" },
      body: { productId: "product-id", quantity: 2 },
      params: { cartId: "cart-id" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    const carts = await db.Carts.findAll();
    cartId2 = carts[1].id;
    const product = await db.CartProducts.findOne({ where: { cartId:cartId2 } });
    productId = product.productId;

  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should login user", (done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "buyer4@gmail.com", password: "Password@123" })
      .end((error, response) => {
        console.log('Login Response: ' + response.body);
        token2 = response.body.data.token;
        done(error);
      });
  });
  it("should update cart product if already exist", (done) => {
    router()
      .post("/api/cart/create-update-cart")
      .set("authorization", `Bearer ${token2}`)
      .send({ productId:productId , quantity: 3 })
      .end((error,response)=>{
        expect(response).to.have.status(httpStatus.CREATED);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("status", httpStatus.CREATED);
        expect(response.body).to.have.property("message", "Cart added successfully");
        expect(response.body).to.have.property("data")
        done(error);
      })

  });

  it("should add product to existing cart if cart exists", async () => {
    const mockCart = { id: "cart-id", userId: "user-id", status: "pending" };
      const mockProduct = {
        id: "product-id",
        name: "Product 1",
        price: 50,
        images: ["image1.jpg"],
        shopId: "shop-id"
      };
      const mockCartProducts = [
        {
          quantity: 2,
          products: {
            id: "product-id-2",
            name: "Product 1",
            price: 50,
            images: ["image1.jpg"],
            shopId: "shop-id"
          }
        }
      ];

      sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
      sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);
      sandbox.stub(productRepositories, "findProductById").resolves(mockProduct);
      sandbox.stub(cartRepositories, "addCartProduct").resolves();
      sandbox.stub(cartRepositories, "updateCartProduct").resolves();

       await cartController.buyerCreateUpdateCart(req, res);
      expect(res.status).to.have.been.calledWith(httpStatus.OK);
    });

  it("should handle errors properly", async () => {
    const error = new Error("Something went wrong");
    sinon.stub(cartRepositories, "getCartsByUserId").throws(error);

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
      status: httpStatus.OK,
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
      error: errorMessage,
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
      status: httpStatus.OK,
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
      error: errorMessage,
    });
  });
});

describe("buyerClearCarts", () => {
  let req;
  let res;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      cart: { id: "cart-id" },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should clear all carts and return success message", (done) => {
    router()
      .delete(`/api/cart/buyer-clear-cart/${cartId}`)
      .set("Authorization", `Bearer ${token1}`)
      .end((error, response) => {        
        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("status", httpStatus.OK);
        expect(response.body).to.have.property(
          "message",
          "All products in cart cleared successfully!"
        );
        done(error);
      });
  });

  it("should return 500 internal server error if clearing cart products fails", async () => {
    const errorMessage = "Database error";
    sandbox
      .stub(cartRepositories, "deleteAllCartProducts")
      .rejects(new Error(errorMessage));

    await cartController.buyerClearCart(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    });
  });

  it("should return 500 internal server error if deleting cart fails", async () => {
    sandbox.stub(cartRepositories, "deleteAllCartProducts").resolves();
    const errorMessage = "Database error";
    sandbox
      .stub(cartRepositories, "deleteCartById")
      .rejects(new Error(errorMessage));

    await cartController.buyerClearCart(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    });
  });
});
describe("Payment Controller", () => {
  let req;
  let res;
  let sandbox: sinon.SinonSandbox;

  const stripe = new Stripe("fake_stripe_secret_key");

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "user-id" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("checkout", () => {
    it("should create a checkout session and return the payment URL", async () => {
      const mockCart = db.Carts.build({ id: "cart-id" });
      const mockProducts = [
        { productId: "product-id-1", price: 100, quantity: 1 },
        { productId: "product-id-2", price: 200, quantity: 2 },
      ];
      const mockProductDetails = db.Products.build({
        name: "Product Name",
        images: ["image.jpg"],
        shopId: "shop-id",
      });
      const mockSession = {
        id: "session-id",
        object: "checkout.session",
        url: "https://stripe.com",
      };

      sandbox.stub(cartRepositories, "findCartIdbyUserId").resolves(mockCart);
      sandbox
        .stub(cartRepositories, "findCartProductByCartId")
        .resolves(mockProducts as any);
      sandbox
        .stub(cartRepositories, "findProductById")
        .resolves(mockProductDetails);
      sandbox
        .stub(stripe.checkout.sessions, "create")
        .resolves(mockSession as any);

      const test = await cartController.checkout(req, res);
      console.log("checkout =======>",test)
      expect(res.status).to.have.been.calledWith(200);
    });

    it("should handle errors and return 500", async () => {
      sandbox
        .stub(cartRepositories, "findCartIdbyUserId")
        .throws(new Error("Database error"));

      await cartController.checkout(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({status:httpStatus.INTERNAL_SERVER_ERROR, error: "Database error" });
    });
  });
});
describe("paymentCheckoutSchema", () => {
  it("should validate a valid cartId", () => {
    const data = { cartId: "valid-cart-id" };
    const { error } = paymentCheckoutSchema.validate(data);
    expect(error).to.be.undefined;
  });

  it("should return an error if cartId is missing", () => {
    const data = {};
    const { error } = paymentCheckoutSchema.validate(data);
    expect(error).to.not.be.undefined;
    expect(error?.details[0].message).to.equal('"cartId" is required');
  });

  it("should return an error if cartId is not a string", () => {
    const data = { cartId: 12345 };
    const { error } = paymentCheckoutSchema.validate(data);
    expect(error).to.not.be.undefined;
    expect(error?.details[0].message).to.equal('"cartId" must be a string');
  });

  it("should return an error if cartId is an empty string", () => {
    const data = { cartId: "" };
    const { error } = paymentCheckoutSchema.validate(data);
    expect(error).to.not.be.undefined;
    expect(error?.details[0].message).to.equal(
      '"cartId" is not allowed to be empty'
    );
  });
});

describe('buyerCheckout', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should calculate the total amount and return the cart', async () => {
    const req = {
      cart: {
        cartProducts: [
          { totalPrice: 50 },
          { totalPrice: 100 },
        ],
      },
    } as any;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as any;

    await cartController.buyerCheckout(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.OK,
      data: {
        totalAmount: 150,
        cart: req.cart,
      },
    });
  });

  it('should handle errors and return internal server error status', async () => {
    const req = {
      cart: {
        cartProducts: [
          { totalPrice: 50 },
          { totalPrice: 100 },
        ],
      },
    } as any;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as any;

    
    const error = new Error('Something went wrong');
    const originalForEach = Array.prototype.forEach;
    sandbox.stub(Array.prototype, 'forEach').throws(error);

    await cartController.buyerCheckout(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });

    Array.prototype.forEach = originalForEach; 
  });
});
describe('buyerClearCarts', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should clear all carts and respond with success message', async () => {
    const req = {
      carts: [
        { id: 'cart-id-1' },
        { id: 'cart-id-2' },
      ],
      user: {
        id: 'user-id',
      },
    } as any; 

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as any;

    sandbox.stub(cartRepositories, 'deleteAllCartProducts').resolves();
    sandbox.stub(cartRepositories, 'deleteAllUserCarts').resolves();

    await buyerClearCarts(req, res);

    expect(cartRepositories.deleteAllCartProducts).to.have.been.calledTwice;
    expect(cartRepositories.deleteAllUserCarts).to.have.been.calledOnceWith('user-id');
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.OK,
      message: 'All carts cleared successfully!',
    });
  });

  it('should handle errors and return internal server error status', async () => {
    const req = {
      carts: [
        { id: 'cart-id-1' },
        { id: 'cart-id-2' },
      ],
      user: {
        id: 'user-id',
      },
    } as any;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as any;

    const error = new Error('Something went wrong');
    sandbox.stub(cartRepositories, 'deleteAllCartProducts').rejects(error);

    await buyerClearCarts(req, res);

    expect(cartRepositories.deleteAllCartProducts).to.have.been.calledOnceWith('cart-id-1');
    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  });
});



describe('sendEmailNotification', () => {
  let findUserByAttributesStub: sinon.SinonStub;
  let sendMailStub: sinon.SinonStub;

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(authRepositories, 'findUserByAttributes');
    sendMailStub = sinon.stub(transporter, 'sendMail');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error if findUserByAttributes fails', async () => {
    const errorMessage = 'User not found';
    findUserByAttributesStub.rejects(new Error(errorMessage));

    try {
      await sendEmailNotification('user-id', 'Test message');
      throw new Error('Expected function to throw');
    } catch (error) {
      expect(error).to.be.an('error');
    }
  });

  it('should throw an error if sendMail fails', async () => {
    const user = { id: 'user-id', email: 'user@example.com' };
    findUserByAttributesStub.resolves(user);
    const errorMessage = 'Failed to send email';
    sendMailStub.rejects(new Error(errorMessage));

    try {
      await sendEmailNotification('user-id', 'Test message');
      throw new Error('Expected function to throw');
    } catch (error) {
      expect(error).to.be.an('error');
    }
  });
});

describe("getCartsByProductId", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return the cart with the specified product and user", async () => {
    const mockCart = {
      userId: "user-id",
      cartProducts: [{ productId: "product-id" }],
      order: {}
    };

    sandbox.stub(db.Carts, "findOne").resolves(mockCart);

    const result = await cartRepositories.getCartsByProductId("product-id", "user-id");

    expect(db.Carts.findOne).to.have.been.calledOnceWith({
      where: { userId: "user-id" },
      include: [
        { model: db.CartProducts, as: "cartProducts", where: { productId: "product-id" } },
        { model: db.Orders, as: "order" }
      ]
    });
    expect(result).to.equal(mockCart);
  });

  it("should return null if no cart is found", async () => {
    sandbox.stub(db.Carts, "findOne").resolves(null);

    const result = await cartRepositories.getCartsByProductId("product-id", "user-id");

    expect(db.Carts.findOne).to.have.been.calledOnceWith({
      where: { userId: "user-id" },
      include: [
        { model: db.CartProducts, as: "cartProducts", where: { productId: "product-id" } },
        { model: db.Orders, as: "order" }
      ]
    });
    expect(result).to.be.null;
  });

  it("should throw an error if there is a database error", async () => {
    const errorMessage = "Database error";
    sandbox.stub(db.Carts, "findOne").throws(new Error(errorMessage));

    try {
      await cartRepositories.getCartsByProductId("product-id", "user-id");
    } catch (error) {
      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { userId: "user-id" },
        include: [
          { model: db.CartProducts, as: "cartProducts", where: { productId: "product-id" } },
          { model: db.Orders, as: "order" }
        ]
      });
      expect(error.message).to.equal(errorMessage);
    }
  });
});


describe('Cart Functions', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getShopIdByProductId', () => {
    it('should return shop ID by product ID', async () => {
      const productId = 'testProductId';
      const expectedShopId = 'testShopId';

      sinon.stub(db.Products, 'findOne').resolves({ shopId: expectedShopId } as any);

      const shopId = await cartRepositories.getShopIdByProductId(productId);

      expect(db.Products.findOne).to.have.been.calledWith({ where: { id: productId } });
      expect(shopId).to.equal(expectedShopId);
    });
  });

  describe('getProductByCartIdAndProductId', () => {
    it('should return product by cart ID and product ID', async () => {
      const cartId = 'testCartId';
      const productId = 'testProductId';
      const expectedProduct = { id: 'product1' };

      sinon.stub(db.CartProducts, 'findOne').resolves(expectedProduct as any);

      const product = await cartRepositories.getProductByCartIdAndProductId(cartId, productId);

      expect(db.CartProducts.findOne).to.have.been.calledWith({ where: { cartId, productId } });
      expect(product).to.equal(expectedProduct);
    });
  });

  describe('deleteAllCartProducts', () => {
    it('should delete all cart products by cart ID', async () => {
      const cartId = 'testCartId';

      const destroyStub = sinon.stub(db.CartProducts, 'destroy').resolves();

      await cartRepositories.deleteAllCartProducts(cartId);

      expect(destroyStub).to.have.been.calledWith({ where: { cartId } });
    });
  });

  describe('deleteCartProduct', () => {
    it('should delete a cart product by cart ID and product ID', async () => {
      const cartId = 'testCartId';
      const productId = 'testProductId';

      const destroyStub = sinon.stub(db.CartProducts, 'destroy').resolves();

      await cartRepositories.deleteCartProduct(cartId, productId);

      expect(destroyStub).to.have.been.calledWith({ where: { cartId, productId } });
    });
  });

  describe('deleteAllUserCarts', () => {
    it('should delete all user carts by user ID', async () => {
      const userId = 'testUserId';

      const destroyStub = sinon.stub(db.Carts, 'destroy').resolves();

      await cartRepositories.deleteAllUserCarts(userId);

      expect(destroyStub).to.have.been.calledWith({ where: { userId } });
    });
  });

  describe('deleteCartById', () => {
    it('should delete a cart by ID', async () => {
      const cartId = 'testCartId';

      const destroyStub = sinon.stub(db.Carts, 'destroy').resolves();

      await cartRepositories.deleteCartById(cartId);

      expect(destroyStub).to.have.been.calledWith({ where: { id: cartId } });
    });
  });

  describe('findCartByAttributes', () => {
    it('should find a cart by given attributes', async () => {
      const key1 = 'userId';
      const value1 = 'testUserId';
      const key2 = 'status';
      const value2 = 'active';
      const expectedCart = { id: 'testCartId' };

      sinon.stub(db.Carts, 'findOne').resolves(expectedCart as any);

      const cart = await cartRepositories.findCartByAttributes(key1, value1, key2, value2);

      expect(db.Carts.findOne).to.have.been.calledWith({ where: { [key1]: value1, [key2]: value2 } });
      expect(cart).to.equal(expectedCart);
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
        error: errorMessage
      });
      expect(next).to.not.have.been.called;
    });
  });
});

describe('Cart Controller Tests', () => {
  let req;
  let res;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: 'user-id' },
      body: { productId: 'product-id', quantity: 2 },
      params: { cartId: 'cart-id' }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('buyerGetCart', () => {
    it('should get cart details', async () => {
      const mockCart = { id: 'cart-id' };
      const mockCartProducts = [
        {
          quantity: 2,
          products: {
            id: 'product-id-1',
            name: 'Product 1',
            price: 50,
            discount: 0,
            images: ['image1.jpg']
          }
        },
        {
          quantity: 1,
          products: {
            id: 'product-id-2',
            name: 'Product 2',
            price: 100,
            discount: 0,
            images: ['image2.jpg']
          }
        }
      ];
      
      sandbox.stub(cartRepositories, 'getCartByUserIdAndCartId').resolves(mockCart);
      sandbox.stub(cartRepositories, 'getCartProductsByCartId').resolves(mockCartProducts);

      await cartController.buyerGetCart(req, res);

      const cartTotal = mockCartProducts.reduce((acc, item) => {
        const totalPrice = item.quantity * item.products.price;
        return acc + totalPrice;
      }, 0);

      expect(res.status).to.have.been.calledWith(httpStatus.OK);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.OK,
        message: 'Cart details',
        data: {
          cartId: mockCart.id,
          products: mockCartProducts.map(product => ({
            id: product.products.id,
            name: product.products.name,
            price: product.products.price,
            discount: product.products.discount,
            image: product.products.images[0],
            quantity: product.quantity,
            totalPrice: product.quantity * product.products.price
          })),
          total: cartTotal
        }
      });
    });

    it('should handle errors in getting cart details', async () => {
      const error = new Error('Something went wrong');
      sandbox.stub(cartRepositories, 'getCartByUserIdAndCartId').throws(error);

      await cartController.buyerGetCart(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
      });
    });
  });

  describe('buyerGetCarts', () => {
    it('should get all carts for a buyer', async () => {
      const mockCart = { id: 'cart-id' };
      const mockCartProducts = [
        {
          quantity: 2,
          products: {
            id: 'product-id-1',
            name: 'Product 1',
            price: 50,
            discount: 0,
            images: ['image1.jpg']
          }
        },
        {
          quantity: 1,
          products: {
            id: 'product-id-2',
            name: 'Product 2',
            price: 100,
            discount: 0,
            images: ['image2.jpg']
          }
        }
      ];

      sandbox.stub(cartRepositories, 'getCartsByUserId').resolves([mockCart]);
      sandbox.stub(cartRepositories, 'getCartProductsByCartId').resolves(mockCartProducts);

      await cartController.buyerGetCarts(req, res);

      const cartTotal = mockCartProducts.reduce((acc, item) => {
        const totalPrice = item.quantity * item.products.price;
        return acc + totalPrice;
      }, 0);

      expect(res.status).to.have.been.calledWith(httpStatus.OK);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.OK,
        message: "Buyer's all carts",
        data: {
          allCartsDetails: [
            {
              cartId: mockCart.id,
              products: mockCartProducts.map(product => ({
                id: product.products.id,
                name: product.products.name,
                price: product.products.price,
                discount: product.products.discount,
                image: product.products.images[0],
                quantity: product.quantity,
                totalPrice: product.quantity * product.products.price
              })),
              total: cartTotal
            }
          ]
        }
      });
    });

    it('should handle errors in getting all carts', async () => {
      const error = new Error('Something went wrong');
      sandbox.stub(cartRepositories, 'getCartsByUserId').throws(error);

      await cartController.buyerGetCarts(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: error.message
      });
    });
  });
});

describe("Payment Handlers", () => {

  afterEach(() => {
  });

  it("should handle payment success", (done) => {
    router()
    .get("/api/cart/payment-success")
    .set("authorization", `Bearer ${token2}`)
    .end((error, response) => {
       expect(response.status).to.equal(httpStatus.OK);
       expect(response.body).to.deep.equal({ status: httpStatus.OK, message: 'Payment successful!' });
       done(error)
     });
    })

  it("should handle payment cancellation", (done) => {
    router()
    .get("/api/cart/payment-canceled")
    .set("authorization", `Bearer ${token2}`)
    .end((error, response) => {
console.log(response)
       expect(response.status).to.equal(httpStatus.OK);
       expect(response.body).to.deep.equal({ status: httpStatus.OK, message: 'Payment canceled' });
       done(error)
     });
  });
});