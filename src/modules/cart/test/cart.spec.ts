import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import cartController from "../controller/cartControllers";
import db from "../../../databases/models";
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
    sandbox.stub(cartRepositories, "getCartByUserId").resolves(mockCart);
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);
    await cartController.buyerGetCart(req, res);
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Cart retrieved successfully.",
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
  it("should handle errors properly", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(cartRepositories, "getCartByUserId").throws(error);
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
      const mockCart = { id: "cart-id", userId: "user-id", status: "pending" };
      sandbox.stub(db.Carts, "findOne").resolves(mockCart);
      const result = await cartRepositories.getCartByUserId("user-id");
      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { userId: "user-id", status: "pending" }
      });
      expect(result).to.equal(mockCart);
    });
    it("should return null if no cart is found", async () => {
      sandbox.stub(db.Carts, "findOne").resolves(null);
      const result = await cartRepositories.getCartByUserId("user-id");
      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { userId: "user-id", status: "pending" }
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









