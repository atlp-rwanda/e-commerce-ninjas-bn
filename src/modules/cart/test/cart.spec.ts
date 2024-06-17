import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import cartRepositories from "../repositories/cartRepositories";
import cartController from "../controller/cartControllers";
import db from "../../../databases/models";
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
    const mockCarts = [
      { id: "6ee2addd-5270-4855-969b-1f56608b122b" }
    ];
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
  
    sandbox.stub(cartRepositories, "getCartsByUserId").resolves(mockCarts);
    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves(mockCartProducts);
    
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
      ]
    });
  });
  
  it("should handle errors properly", async () => {
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

describe("Cart Repositories", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("getCartsByUserId", () => {
    it("should return a cart for a given user ID with pending status", async () => {
      const mockCarts = [{ id: "6ee2addd-5270-4855-969b-1f56608b122b", userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }];
      sandbox.stub(db.Carts, "findAll").resolves(mockCarts);

      const result = await cartRepositories.getCartsByUserId("6ee2addd-5270-4855-969b-1f56608b122e");

      expect(db.Carts.findAll).to.have.been.calledOnceWith({
        where: { userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.eql(mockCarts);
    });

    it("should return an empty array if no cart is found", async () => {
      sandbox.stub(db.Carts, "findAll").resolves([]);

      const result = await cartRepositories.getCartsByUserId("6ee2addd-5270-4855-969b-1f56608b122e");

      expect(db.Carts.findAll).to.have.been.calledOnceWith({
        where: { userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.be.an("array").that.is.empty;
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
      expect(result).to.eql(mockCartProducts);
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

  describe("getCartByUserIdAndCartId", () => {
    it("should return a cart for a given user ID and cart ID with pending status", async () => {
      const mockCart = { id: "6ee2addd-5270-4855-969b-1f56608b122b", userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" };
      sandbox.stub(db.Carts, "findOne").resolves(mockCart);

      const result = await cartRepositories.getCartByUserIdAndCartId("6ee2addd-5270-4855-969b-1f56608b122e", "cart-id");

      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { id: "cart-id", userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.eql(mockCart);
    });

    it("should return null if no cart is found", async () => {
      sandbox.stub(db.Carts, "findOne").resolves(null);

      const result = await cartRepositories.getCartByUserIdAndCartId("6ee2addd-5270-4855-969b-1f56608b122e", "cart-id");

      expect(db.Carts.findOne).to.have.been.calledOnceWith({
        where: { id: "cart-id", userId: "6ee2addd-5270-4855-969b-1f56608b122e", status: "pending" }
      });
      expect(result).to.be.null;
    });
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

      expect(db.CartProducts.update).to.have.been.calledOnceWith(cartProductData, { where: { id: productId } });
    });
  });

  describe("getShopIdByProductId", () => {
    it("should return the shop ID for a given product ID", async () => {
      const productId = "product-id";
      const mockProduct = { shopId: "shop-id" };
      sandbox.stub(db.Products, "findOne").resolves(mockProduct);

      const result = await cartRepositories.getShopIdByProductId(productId);

      expect(db.Products.findOne).to.have.been.calledOnceWith({ where: { id: productId } });
      expect(result).to.equal(mockProduct.shopId);
    });
  });

  describe("addCartProduct", () => {
    it("should add a new cart product", async () => {
      const cartProductData = { cartId: "cart-id", productId: "product-id", quantity: 3 };
      const mockCartProduct = { id: "cart-product-id", ...cartProductData };
      sandbox.stub(db.CartProducts, "create").resolves(mockCartProduct);

      const result = await cartRepositories.addCartProduct(cartProductData);

      expect(db.CartProducts.create).to.have.been.calledOnceWith(cartProductData);
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
      message: "Cart product added successfully"
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


describe("Cart Routes", () => {
  let sandbox;
  let req;
  let res;

  beforeEach(() => {
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
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a cart", async () => {
    sandbox.stub(cartRepositories, "addCart").resolves({ id: "cart-id" });
    sandbox.stub(productRepositories, "findProductById").resolves({ price: 50, discount: 0 });
    sandbox.stub(cartRepositories, "addCartProduct").resolves({});

    await cartController.buyerAddCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    // expect(res.json).to.have.been.calledWith({ message: "Cart added successfully", data: {} });
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
      data: [{
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
      }]
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

  it("should update cart details", async () => {
    const mockCartProduct = { id: "cart-product-id", price: 50, quantity: 2 };
    const mockProduct = { price: 50, discount: 0 };

    sandbox.stub(cartRepositories, "getCartProductsByCartId").resolves([mockCartProduct]);
    sandbox.stub(cartRepositories, "updateCartProduct").resolves();
    sandbox.stub(productRepositories, "findProductById").resolves(mockProduct);
    sandbox.stub(cartRepositories, "addCartProduct").resolves({});

    await cartController.buyerUpdateCart(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({ message: "Cart product added successfully" });
  });

  it("should update cart product quantity and total price", async () => {
    const existingCartProduct = { id: "cart-product-id", price: 50, quantity: 2 };
    const updatedQuantity = 3;
    const updatedTotalPrice = existingCartProduct.price * updatedQuantity;
  
    sandbox.stub(cartRepositories, "updateCartProduct").resolves();
  
    await cartRepositories.updateCartProduct(existingCartProduct.id, { quantity: updatedQuantity, totalPrice: updatedTotalPrice });
  
    expect(cartRepositories.updateCartProduct).to.have.been.calledOnceWith(existingCartProduct.id, { quantity: updatedQuantity, totalPrice: updatedTotalPrice });
  });

});
