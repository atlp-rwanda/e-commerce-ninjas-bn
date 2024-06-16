import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import cartController from "../controller/cartControllers";
import db from "../../../databases/models";
import app from "../../..";
import { isCartExist, isCartIdExist, isProductIdExist } from "../../../middlewares/validation";
import productRepositories from "../../product/repositories/productRepositories";
chai.use(chaiHttp);
describe("Buyer Get Cart", () => {
  let req;
  let res;
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "user-id" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });
  afterEach(() => {
    sandbox.restore();
  });
  it("should return cart details when cart exists", async () => {
    const mockCart = { id: "6ee2addd-5270-4855-969b-1f56608b122b" };
    const mockCartProducts = [
      {
        quantity: 2,
        products: {
          id: "6ee2addd-5270-4855-969b-1f56608b122c",
          name: "Product 1",
          price: 50,
          images: ["image1.jpg"]
        }
      },
      {
        quantity: 1,
        products: {
          id: "6ee2addd-5270-4855-969b-1f56608b122d",
          name: "Product 2",
          price: 100,
          images: ["image2.jpg"]
        }
      }
    ];
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves(mockCart);
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);
    await cartController.buyerGetCart(req, res);
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Cart retrieved successfully.",
      data: {
        cartId: mockCart.id,
        products: [
          {
            id: "6ee2addd-5270-4855-969b-1f56608b122c",
            name: "Product 1",
            price: 50,
            image: "image1.jpg",
            quantity: 2,
            totalPrice: 100
          },
          {
            id: "6ee2addd-5270-4855-969b-1f56608b122d",
            name: "Product 2",
            price: 100,
            image: "image2.jpg",
            quantity: 1,
            totalPrice: 100
          }
        ],
        total: 200
      }
    });
  });
  it("should handle errors properly", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "getCartsByUserId").throws(error);
    await cartController.buyerGetCart(req, res);
    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
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
  describe("getCartByUserId", () => {
    it("should return a cart for a given user ID with pending status", async () => {
      const mockCart = { id: "6ee2addd-5270-4855-969b-1f56608b122b", userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" };
      sandbox.stub(db.Carts, "findOne").resolves(mockCart);
      const result = await cartRepositories.getCartsByUserId("6ee2addd-5270-4855-969b-1f56608b122e");
      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.equal(mockCart);
    });
    it("should return null if no cart is found", async () => {
      sandbox.stub(db.Carts, "findOne").resolves(null);
      const result = await cartRepositories.getCartsByUserId("6ee2addd-5270-4855-969b-1f56608b122e");
      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.be.null;
    });
  });
  describe("getCartProductsByCartId", () => {
    it("should return cart products for a given cart ID", async () => {
      const mockCartProducts = [
        {
          quantity: 2,
          products: {
            id: "product-id-1",
            name: "Product 1",
            price: 50,
            images: ["image1.jpg"]
          }
        },
        {
          quantity: 1,
          products: {
            id: "product-id-2",
            name: "Product 2",
            price: 100,
            images: ["image2.jpg"]
          }
        }
      ];
      sandbox.stub(db.CartProducts, "findAll").resolves(mockCartProducts);
      const result = await cartRepositories.getCartProductsByCartId("cart-id");
      expect(db.CartProducts.findAll).to.have.been.calledOnceWith({
        where: { cartId: "cart-id" },
        include: [
          {
            model: db.Products,
            as: "products",
            attributes: ["id", "name", "price", "images"]
          }
        ]
      });
      expect(result).to.equal(mockCartProducts);
    });
    it("should return an empty array if no cart products are found", async () => {
      sandbox.stub(db.CartProducts, "findAll").resolves([]);
      const result = await cartRepositories.getCartProductsByCartId("cart-id");
      expect(db.CartProducts.findAll).to.have.been.calledOnceWith({
        where: { cartId: "cart-id" },
        include: [
          {
            model: db.Products,
            as: "products",
            attributes: ["id", "name", "price", "images"]
          }
        ]
      });
      expect(result).to.be.an("array").that.is.empty;
    });
  });
});







describe("Cart Routes", () => {
  let sandbox;
  let token;

  before(async () => {
    // Login user to get token
    const res = await chai.request(app)
      .post("/api/auth/login")
      .send({
        email: "buyer2@gmail.com",
        password: "Password@123"
      });

    expect(res).to.have.status(httpStatus.OK);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.have.property("token");
    token = res.body.data.token;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a cart", async () => {
    sandbox.stub(db.Carts, "create").resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1229" });
    sandbox.stub(db.Products, "findOne").resolves({ price: 50, discount: 0 });
    sandbox.stub(db.CartProducts, "create").resolves({});

    const res = await chai.request(app)
      .post("/buyer-create-cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "6ee2addd-5270-4855-969b-1f56608b122b", quantity: 2 });

    expect(res).to.have.status(httpStatus.CREATED);
    expect(res.body.message).to.equal("Cart added successfully");
  });

  it("should get all carts for a buyer", async () => {
    const mockCart = { id: "6ee2addd-5270-4855-969b-1f56608b1229" };
    const mockCartProducts = [
      {
        quantity: 2,
        products: {
          id: "product-id-1",
          name: "Product 1",
          price: 50,
          images: ["image1.jpg"]
        }
      },
      {
        quantity: 1,
        products: {
          id: "product-id-2",
          name: "Product 2",
          price: 100,
          images: ["image2.jpg"]
        }
      }
    ];
    sandbox.stub(db.Carts, "findAll").resolves([mockCart]);
    sandbox.stub(db.CartProducts, "findAll").resolves(mockCartProducts);

    const res = await chai.request(app)
      .get("/buyer-get-carts")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(httpStatus.OK);
    expect(res.body.message).to.equal("Buyer's all carts");
  });

  it("should get cart details for a specific cart ID", async () => {
    const mockCart = { id: "6ee2addd-5270-4855-969b-1f56608b1229" };
    const mockCartProducts = [
      {
        quantity: 2,
        products: {
          id: "product-id-1",
          name: "Product 1",
          price: 50,
          images: ["image1.jpg"]
        }
      },
      {
        quantity: 1,
        products: {
          id: "product-id-2",
          name: "Product 2",
          price: 100,
          images: ["image2.jpg"]
        }
      }
    ];
    sandbox.stub(db.Carts, "findOne").resolves(mockCart);
    sandbox.stub(db.CartProducts, "findAll").resolves(mockCartProducts);

    const res = await chai.request(app)
      .get("/buyer-get-cart/6ee2addd-5270-4855-969b-1f56608b1229")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(httpStatus.OK);
    expect(res.body.message).to.equal("Cart details");
  });

  it("should update cart details", async () => {
    const mockCartProduct = { id: "6ee2addd-5270-4855-969b-1f56608b1228", price: 50, quantity: 2 };
    const mockProduct = { price: 50, discount: 0 };
    sandbox.stub(db.CartProducts, "findAll").resolves([mockCartProduct]);
    sandbox.stub(db.CartProducts, "update").resolves([1, [mockCartProduct]]);
    sandbox.stub(db.Products, "findOne").resolves(mockProduct);
    sandbox.stub(db.CartProducts, "create").resolves({});

    const res = await chai.request(app)
      .put("/buyer-update-cart/6ee2addd-5270-4855-969b-1f56608b1229")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: "product-id", quantity: 3 });

    expect(res).to.have.status(httpStatus.OK);
    expect(res.body.message).to.equal("Cart updated successfully");
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
      params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" }
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

  it("should check if cart exists", async () => {
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves([{ id: "cart-id" }]);

    await isCartExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if no cart exists", async () => {
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves([]);

    await isCartExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "No cart found. Please create cart first."
    });
  });

  it("should check if product ID exists", async () => {
    sandbox.stub(productRepositories, "findProductById").resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1228" });

    await isProductIdExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if product ID does not exist", async () => {
    sandbox.stub(productRepositories, "findProductById").resolves(null);

    await isProductIdExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "No product with that ID."
    });
  });

  it("should check if cart ID exists", async () => {
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").resolves({ id: "6ee2addd-5270-4855-969b-1f56608b1229" });

    await isCartIdExist(req, res, next);

    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if cart ID does not exist", async () => {
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").resolves(null);

    await isCartIdExist(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "Cart not found. Please add items to your cart."
    });
  });
});

describe("Cart Controller", () => {
  let req;
  let res;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      user: { id: "6ee2addd-5270-4855-969b-1f56608b122e" },
      body: { productId: "6ee2addd-5270-4855-969b-1f56608b1228", quantity: 2 },
      params: { cartId: "6ee2addd-5270-4855-969b-1f56608b1229" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should add a cart", async () => {
    const mockCart = { id: "cart-id" };
    const mockProduct = { price: 50, discount: 0 };
    sandbox.stub(cartRepositories, "addCart").resolves(mockCart);
    sandbox.stub(productRepositories, "findProductById").resolves(mockProduct);
    sandbox.stub(cartRepositories, "addCartProduct").resolves({});

    await cartController.buyerAddCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.CREATED);
    expect(res.json).to.have.been.calledWith({
      message: "Cart added successfully",
      data: {}
    });
  });

  it("should handle errors in adding a cart", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "addCart").throws(error);

    await cartController.buyerAddCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
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
          images: ["image1.jpg"]
        }
      },
      {
        quantity: 1,
        products: {
          id: "product-id-2",
          name: "Product 2",
          price: 100,
          images: ["image2.jpg"]
        }
      }
    ];
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").resolves(mockCart);
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);

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
            totalPrice: 100
          },
          {
            id: "product-id-2",
            name: "Product 2",
            price: 100,
            image: "image2.jpg",
            quantity: 1,
            totalPrice: 100
          }
        ],
        total: 200
      }
    });
  });

  it("should handle errors in getting cart details", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "getCartByUserIdAndCartId").throws(error);

    await cartController.buyerGetCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  });

  it("should update a cart", async () => {
    const mockCartProduct = { id: "cart-product-id", price: 50, quantity: 2 };
    const mockProduct = { price: 50, discount: 0 };
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves([mockCartProduct]);
    sandbox.stub(cartRepositories, "updateCartProduct").resolves([1, [mockCartProduct]]);
    sandbox.stub(productRepositories, "findProductById").resolves(mockProduct);
    sandbox.stub(cartRepositories, "addCartProduct").resolves({});

    await cartController.buyerUpdateCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Cart updated successfully"
    });
  });

  it("should handle errors in updating a cart", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "getCartProductsByCartId").throws(error);

    await cartController.buyerUpdateCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
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
          images: ["image1.jpg"]
        }
      },
      {
        quantity: 1,
        products: {
          id: "product-id-2",
          name: "Product 2",
          price: 100,
          images: ["image2.jpg"]
        }
      }
    ];
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves([mockCart]);
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);

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
              totalPrice: 100
            },
            {
              id: "product-id-2",
              name: "Product 2",
              price: 100,
              image: "image2.jpg",
              quantity: 1,
              totalPrice: 100
            }
          ],
          total: 200
        }
      ]
    });
  });

  it("should handle errors in getting all carts", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "getCartsByUserId").throws(error);

    await cartController.buyerGetCarts(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message
    });
  });
});