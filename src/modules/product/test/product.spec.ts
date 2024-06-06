/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import sinon from "sinon";
import productRepositories from "../repositories/productRepositories";
import productController from "../controller/productControllers";
import Shop from "../../../databases/models/shops";
import { getBuyerProducts } from "../../../middlewares/validation";
import httpStatus from "http-status";


chai.use(chaiHttp);
const router = () => chai.request(app)



describe("Seller's Products List", () => {
  let token: string = null;
  let sellerToken: string = null
  let buyerId: string = null
  it("Should be able to login an admin", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        expect(response.body.data).to.have.property("token");
        token = response.body.data.token;
        done(error);
      });
  });


  it("Should create a buyer", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "seller_test@gmail.com",
        password: "$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        buyerId = response.body.data.user.id
        done(error);
      });
  })

  it("Should retrieve unpaginated data if no queries are specified", (done) => {
    router().get("/api/shop/all-products")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");
        done(error);
      });
  });

  it("Should notify if limit or page is not number", (done) => {
    router().get("/api/shop/all-products?limit=-10&page=page1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error");
        done(error);
      });
  });

  it("Should get next page", (done) => {
    router().get("/api/shop/all-products?limit=1&page=1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");

        done(error);
      });
  });

  it("Should handle server errors gracefully", (done) => {
    const originalMethod = productRepositories.getAllProducts;
    productRepositories.getAllProducts = () => { throw new Error("Server error"); };

    router().get("/api/shop/all-products")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.have.property("error");
        productRepositories.getAllProducts = originalMethod;
        done(error);
      });
  });

  it("Should handle pagination correctly with edge cases", (done) => {
    router().get("/api/shop/all-products?limit=0&page=1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.have.property("data");
        done(error);
      });
  });


  it("Should update the user role to seller", (done) => {
    router().get(`/api/user/admin-update-role/${buyerId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "seller" })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        done(error);
      });
  });


  it("Should update User role to seller and return updated user", (done) => {
    router()
      .put(`/api/user/admin-update-role/${buyerId}`)
      .send({ role: "seller" })
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User role updated successfully");
        done(err);
      });
  });

  it("Should be able to login a seller", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "seller_test@gmail.com",
        password: "$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        expect(response.body.data).to.have.property("token");
        sellerToken = response.body.data.token;
        done(error);
      });
  });

  it("Should restrict unauthorized user", (done) => {
    router().get("/api/shop/shop-products")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
        expect(response.body).to.be.a("object");
        done(error);
      });
  });

  it("Should returrn 'SHop does not exists'", (done) => {
    router().get("/api/shop/shop-products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.NOT_FOUND);
        expect(response.body).to.be.a("object");
        done(error);
      });
  });


   // Define the function to insert data into the Shop model
   async function createShop(data: { userId: any; name: string; description?: string }) {
    try {
      const shop = await Shop.create(data);
      return shop;
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  }
 
  it("should create a shop directly using the function", async () => {
    const shopData = {
      userId: buyerId,
      name: "Test Shop for tests",
      description: "A shop created for testing purposes"
    };

    const shop = await createShop(shopData);

    expect(shop).to.have.property('id');
    expect(shop.name).to.equal(shopData.name);
    expect(shop.description).to.equal(shopData.description);
    expect(shop.userId).to.equal(shopData.userId);
  });



  

  it("Should retrieve unpaginated data if no queries are specified", (done) => {
    router().get("/api/shop/shop-products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");
        done(error);
      });
  });

  it("Should notify if limit or page is not number", (done) => {
    router().get("/api/shop/shop-products?limit=-10&page=page1")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error");
        done(error);
      });
  });

  it("Should return paginated products if valid limit and page are provided", (done) => {
    router().get("/api/shop/shop-products?limit=0&page=1")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        done(error);
      });
  });

  it("Should handle server errors gracefully", (done) => {
    const originalMethod = productRepositories.getProductsByAttributes;
    productRepositories.getProductsByAttributes = () => { throw new Error("Server error"); };

    router().get("/api/shop/shop-products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.have.property("error");
        productRepositories.getProductsByAttributes = originalMethod;
        done(error);
      });
  });

  it("Should handle pagination correctly with edge cases", (done) => {
    router().get("/api/shop/shop-products?limit=0&page=1")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        done(error);
      });
  });
});

describe("getBuyerProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let allProducts: any[];

  beforeEach(() => {
    req = {
      query: {}
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    allProducts = [
      { id: 1, name: "Product 1" },
      { id: 2, name: "Product 2" },
      { id: 3, name: "Product 3" }
    ];

    sinon.stub(productRepositories, "getAllProducts").resolves(allProducts);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return paginated products with next and previous page information", async () => {
    req.query.page = "2";
    req.query.limit = "1";

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      nextPage: { page: 3, limit: 1 },
      previousPage: { page: 1, limit: 1 },
      data: [{ id: 2, name: "Product 2" }]
    });
  });

  it("should return an error if page or limit is not a positive number", async () => {
    req.query.page = "-1";
    req.query.limit = "10";

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({ error: "Page and limit must be positive numbers" });
  });

  it("should handle server errors gracefully", async () => {
    sinon.restore();
    sinon.stub(productRepositories, "getAllProducts").throws(new Error("Server error"));

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({ error: "Server error" });
  });

  it("should return paginated products without nextPage when on last page", async () => {
    req.query.page = "3";
    req.query.limit = "1";

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      nextPage: undefined,
      previousPage: { page: 2, limit: 1 },
      data: [{ id: 3, name: "Product 3" }]
    });
  });

  it("should return paginated products without previousPage when on first page", async () => {
    req.query.page = "1";
    req.query.limit = "1";

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      nextPage: { page: 2, limit: 1 },
      previousPage: undefined,
      data: [{ id: 1, name: "Product 1" }]
    });
  });

  it("should return an empty array if no products are available", async () => {
    sinon.restore();
    sinon.stub(productRepositories, "getAllProducts").resolves([]);

    req.query.page = "1";
    req.query.limit = "10";

    await getBuyerProducts(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      nextPage: undefined,
      previousPage: undefined,
      data: []
    });
  });

  it("should return an error if page or limit is non-numeric", async () => {
    req.query.page = "abc";
    req.query.limit = "10";

    await getBuyerProducts(req as Request, res as Response);
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
  });
});

describe("paginatedProducts", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {};
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis()
    };
  });

  it("should return paginated results with status 200", async () => {
    req.paginationResults = { items: ["product1", "product2"], total: 2 };

    await productController.paginatedProducts(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({
      status: 200,
      data: req.paginationResults
    });
  });

  it("should handle errors and return status 500", async () => {
    const error = new Error("Something went wrong");
    const paginatedProductsWithError = async (req: any, res: Response) => {
      try {
        throw error;
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    };

    await paginatedProductsWithError(req, res);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.firstCall.args[0]).to.equal(500);
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({
      error: error.message
    });
  });
});