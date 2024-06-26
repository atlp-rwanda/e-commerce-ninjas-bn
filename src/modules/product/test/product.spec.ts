/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import path from "path";
import fs from "fs";
import { fileFilter } from "../../../helpers/multer";
import {
  credential,
  isProductExist,
  isShopExist,
  transformFilesToBody,
  isPaginated,
  isProductExistToWishlist,
  isUserWishlistExistById,
  isUserWishlistExist,
} from "../../../middlewares/validation";
import sinon, { SinonStub } from "sinon";
import productRepositories from "../repositories/productRepositories";
import httpStatus from "http-status";
import * as productController from "../controller/productController";
import userRepositories from "../../user/repository/userRepositories";
import userControllers from "../../user/controller/userControllers";
import authRepositories from "../../auth/repository/authRepositories";
import { ExtendRequest } from "../../../types";
import Product from "../../../databases/models/products";
import Shop from "../../../databases/models/shops";
import User from "../../../databases/models/users";
import { sendEmail, transporter } from "../../../services/sendEmail";
import updateExpiredProducts from "../../../helpers/updateExpiredProducts";

chai.use(chaiHttp);
const router = () => chai.request(app);
const imagePath = path.join(
  __dirname,
  "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
);
const imageBuffer = fs.readFileSync(imagePath);
describe("Product and Shops API Tests", () => {
  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "dj@gmail.com", password: "Password@123" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      });
  });
  describe("POST /api/shop/seller-create-shop", () => {
    it("should give an error", (done) => {
      router()
        .get("/api/shop/seller-get-products")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });

    it("should create a Shop successfully", (done) => {
      router()
        .post("/api/shop/seller-create-shop")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New Shops",
          description: "A new Shops description",
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property(
            "message",
            "Shop created successfully"
          );
          expect(res.body.data.shop).to.include({
            name: "New Shops",
            description: "A new Shops description",
          });
          done();
        });
    });

    it("should return a validation error when name is missing", (done) => {
      router()
        .post("/api/shop/seller-create-shop")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "A new Shops description" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("status", 400);
          expect(res.body).to.have.property("message", "Name is required");
          done();
        });
    });

    it("should Already have a shop", (done) => {
      router()
        .post("/api/shop/seller-create-shop")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New Shops",
          description: "A new Shops description",
        })
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.BAD_REQUEST);
          expect(res.body).to.have.property("message", "Already have a shop.");
          expect(res.body).to.have.property("data");
          done();
        });
    });
  });

  it("should give an error on notifications", (done) => {
    router()
      .get("/api/user/user-get-notifications")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("status", httpStatus.NOT_FOUND);
        done();
      });
  });

  describe("POST /api/shop/seller-create-product", () => {
    let productId: string;
    let notificationId: string;
    it("should create a product successfully", (done) => {
      router()
        .post("/api/shop/seller-create-product")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "New Product")
        .field("description", "A new product description")
        .field("price", "99.99")
        .field("category", "Electronics")
        .field("quantity", "10")
        .field("bonus", "10%")
        .field("discount", "10%")
        .field("expiryDate", "2040-4-4")
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.CREATED);
          expect(res.body).to.have.property(
            "message",
            "Product created successfully"
          );
          expect(res.body.data.product).to.include({
            name: "New Product",
            description: "A new product description",
          });
          productId = res.body.data.product.id;
          done();
        });
    });

    it("should get available products successfully", (done) => {
      router()
        .get("/api/shop/user-get-products")
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.OK);
          expect(res.body).to.have.property("status", httpStatus.OK);
          done();
        });
    });

    it("should get notifications", (done) => {
      router()
        .get("/api/user/user-get-notifications")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.OK);
          expect(res.body).to.have.property("status", httpStatus.OK);
          notificationId = res.body.data.notifications[0].id;
          done();
        });
    });

    it("should give an error for getting a single notification", (done) => {
      router()
        .get(`/api/user/user-get-notification/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.NOT_FOUND);
          expect(res.body).to.have.property("status", httpStatus.NOT_FOUND);
          done();
        });
    });

    it("should get single notification", (done) => {
      router()
        .get(`/api/user/user-get-notification/${notificationId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.OK);
          expect(res.body).to.have.property("status", httpStatus.OK);
          done();
        });
    });

    it("should update a product successfully", (done) => {
      router()
        .put(`/api/shop/seller-update-product/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("name", "Updated Product")
        .field("description", "An updated product description")
        .field("price", "88.44")
        .field("category", "Electronics")
        .field("bonus", "15%")
        .field("discount", "11%")
        .field("expiryDate", "2040-11-12")
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .attach(
          "images",
          imageBuffer,
          "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        )
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it("should update product status to unavailable", (done) => {
      router()
        .put(`/api/shop/seller-update-product-status/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "unavailable" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property(
            "message",
            "Status updated successfully."
          );
          done();
        });
    });

    it("should get all products", (done) => {
      router()
        .get("/api/shop/seller-get-products")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property(
            "message",
            "All products fetched successfully."
          );
          done();
        });
    });

    it("should return a validation error when images are missing", (done) => {
      router()
        .post("/api/shop/seller-create-product")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "New Product")
        .field("description", "A new product description")
        .field("price", "99.99")
        .field("category", "Electronics")
        .field("quantity", "10")
        .field("bonus", "10%")
        .field("discount", "10%")
        .field("expiryDate", "2040-4-4")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("status", 400);
          expect(res.body).to.have.property(
            "message",
            "Images must have at least 4 items"
          );
          done();
        });
    });

    it("should  delete items in collection", (done) => {
      router()
        .delete(`/api/shop/seller-delete-product/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((error, response) => {
          expect(response.status).to.be.equal(httpStatus.OK);
          expect(response.body).to.have.property(
            "message",
            "Product deleted successfully"
          );
          done(error);
        });
    });
  });
  describe("Multer Middleware", () => {
    it("should return an error if a non-image file is uploaded", (done) => {
      const req = {} as any;
      const file = {
        originalname: "test.txt",
      } as Express.Multer.File;

      const cb = (err: Error | null) => {
        try {
          expect(err).to.be.an("error");
          expect(err!.message).to.equal("Only images are allowed");
          done();
        } catch (error) {
          done(error);
        }
      };

      fileFilter(req, file, cb);
    });
  });
});

describe("transformFilesToBody Middleware", () => {
  it("should return 400 if no files are provided", () => {
    const req = {
      files: null,
    } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as any;
    const next = sinon.spy();

    transformFilesToBody(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(
      res.json.calledWith({
        status: 400,
        message: "Images are required",
      })
    ).to.be.true;
  });
});

describe("Seller test cases", () => {
  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "seller@gmail.com", password: "Password@123" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      });
  });

  it("should return statistics of Seller in specified timeframe", (done) => {
    router()
      .post("/api/shop/seller-statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        done(error);
      });
  });

  it("should catch server error during fetching statistics", (done) => {
    sinon
      .stub(productRepositories, "getOrdersPerTimeframe")
      .throws(new Error("Database error"));
    router()
      .post("/api/shop/seller-statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        done(err);
      });
  });
});

describe("internal server error", () => {
  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "seller3@gmail.com", password: "Password@123" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      });
  });

  it("should handle errors and return 500 status", (done) => {
    sinon
      .stub(productRepositories, "createShop")
      .throws(new Error("Internal Server Error"));
    router()
      .post("/api/shop/seller-create-shop")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "International Server Error",
        description: "A new Shops description",
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("error", "Internal Server Error");
        done(err);
      });
  });
});

describe("Product Middleware", () => {
  describe("isProductExist", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: { id: 1 },
        body: { name: "Product1" },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return 404 if no shop is found", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").resolves(null);

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.NOT_FOUND,
        message: "Not shop found.",
      });
    });

    it("should return 400 if the product already exists", async () => {
      sinon
        .stub(productRepositories, "findShopByAttributes")
        .resolves({ id: 1 });
      sinon
        .stub(productRepositories, "findByModelsAndAttributes")
        .resolves(true);

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.BAD_REQUEST,
        message: "Please update the quantities.",
      });
    });

    it("should call next if product does not exist", async () => {
      sinon
        .stub(productRepositories, "findShopByAttributes")
        .resolves({ id: 1 });
      sinon
        .stub(productRepositories, "findByModelsAndAttributes")
        .resolves(false);

      await isProductExist(req, res, next);

      expect(req.shop).to.deep.equal({ id: 1 });
      expect(next).to.have.been.called;
    });

    it("should return 500 on error", async () => {
      sinon
        .stub(productRepositories, "findShopByAttributes")
        .throws(new Error("Internal Server Error"));

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    });
  });

  describe("isShopExist", () => {
    let req, res, next;

    beforeEach(() => {
      req = { user: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should call next if no shop is found", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").resolves(null);

      await isShopExist(req, res, next);

      expect(next).to.have.been.called;
    });

    it("should return 400 if a shop already exists", async () => {
      sinon
        .stub(productRepositories, "findShopByAttributes")
        .resolves({ id: 1 });

      await isShopExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.BAD_REQUEST,
        message: "Already have a shop.",
        data: { shop: { id: 1 } },
      });
    });

    it("should return 500 on error", async () => {
      sinon
        .stub(productRepositories, "findShopByAttributes")
        .throws(new Error("Internal Server Error"));

      await isShopExist(req, res, next);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    });
  });
});

describe("Product Controller", () => {
  let token: string;

  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "seller3@gmail.com", password: "Password@123" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 500 if an error occurs in updateProductStatus", async () => {
    const error = new Error("Internal server error");
    sinon.stub(productRepositories, "updateProductByAttributes").throws(error);

    req.body = { status: "available" };
    req.params = { id: "123" };

    await productController.updateProductStatus(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  });

  it("should return 500 if an error occurs in userGetAvailableProducts", async () => {
    const error = new Error("Internal server error");
    sinon.stub(productRepositories, "userGetProducts").throws(error);

    await productController.userGetProducts(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
  });

  describe("sellerCreateProduct", () => {
    let req, res;

    beforeEach(() => {
      req = {
        shop: { id: 1 },
        files: [{ filename: "image1.jpg" }, { filename: "image2.jpg" }],
        body: { name: "Product1" },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(req.files, "map").throws(new Error("File upload error"));

      await productController.sellerCreateProduct(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        error: "File upload error",
      });
    });
  });
});

describe("Admin Controller", () => {
  describe("adminGetUsers", () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon
        .stub(userRepositories, "getAllUsers")
        .throws(new Error("Internal Server Error"));

      await userControllers.adminGetUsers(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    });
  });

  describe("adminGetUser", () => {
    let req, res;

    beforeEach(() => {
      req = { params: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon
        .stub(authRepositories, "findUserByAttributes")
        .throws(new Error("Internal Server Error"));

      await userControllers.adminGetUser(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    });
  });

  describe("getUserDetails", () => {
    let req, res;

    beforeEach(() => {
      req = { user: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon
        .stub(authRepositories, "findUserByAttributes")
        .throws(new Error("Internal Server Error"));

      await userControllers.getUserDetails(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      });
    });
  });

  describe("updateUserProfile", () => {
    let req, res;

    beforeEach(() => {
      req = {
        user: { id: 1 },
        file: {
          path: "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg",
          filename: "69180880-2138-11eb-8b06-03db3ef1abad.jpeg",
        },
        body: { name: "John Doe" },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon
        .stub(userRepositories, "updateUserProfile")
        .throws(new Error("Internal Server Error"));

      await userControllers.updateUserProfile(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
    });
    it("should handle missing required parameter - file", async () => {
      delete req.file;
      await userControllers.updateUserProfile(req, res);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
    });
  });
});

describe("Change Password Test Cases", () => {
  let token: string = null;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "Newpassword#12",
      })
      .end((error, response) => {
        token = response.body.data.token;
        done(error);
      });
  });
  it("should change the password when the user changes the password", (done) => {
    router()
      .put("/api/user/change-password")
      .set("authorization", `Bearer ${token}`)
      .send({
        oldPassword: "Newpassword#12",
        newPassword: "NewPassword!123",
        confirmPassword: "NewPassword!123",
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "message",
          "Password updated successfully"
        );
        done(err);
      });
  });
  it("should return an error if the password is invalid", (done) => {
    router()
      .put("/api/user/change-password")
      .set("authorization", `Bearer ${token}`)
      .send({
        oldPassword: "Newpassword#12",
        newPassword: "NewPassword!123",
        confirmPassword: "NewPassword!123",
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "Invalid password.");
        done(err);
      });
  });
});

describe("isPaginated middleware", () => {
  let req: Partial<ExtendRequest>;
  let res: Partial<Response>;
  let nextCalled: boolean;

  beforeEach(() => {
    req = {
      query: {},
      pagination: {
        limit: undefined,
        page: undefined,
        offset: undefined,
      },
    };
    res = {};
    nextCalled = false;
  });

  const next: NextFunction = () => {
    nextCalled = true;
  };

  it("should set limit and page parameters if provided in the request query", () => {
    req.query.limit = "10";
    req.query.page = "1";

    isPaginated(req as Request, res as Response, next);

    expect(req.pagination).to.deep.equal({
      limit: 10,
      page: 1,
      offset: 0,
    });
    expect(nextCalled).to.be.true;
  });

  it("should set limit and page as undefined if not provided in the request query", () => {
    isPaginated(req as Request, res as Response, next);

    expect(req.pagination).to.deep.equal({
      limit: undefined,
      page: undefined,
      offset: undefined,
    });
    expect(nextCalled).to.be.true;
  });

  it("should calculate offset if both limit and page are provided in the request query", () => {
    req.query.limit = "10";
    req.query.page = "2";

    isPaginated(req as Request, res as Response, next);

    expect(req.pagination).to.deep.equal({
      limit: 10,
      page: 2,
      offset: 10,
    });
    expect(nextCalled).to.be.true;
  });
});

describe("User filter products", () => {
  it("Should reject if one of Min and Max Price Provided without other", (done) => {
    router()
      .get("/api/shop/user-search-products?minprice=1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });
  it("Should reject if min price is greater than max price", (done) => {
    router()
      .get("/api/shop/user-search-products?minprice=10&maxprice=1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });
  it("Should return data if data are provided", (done) => {
    router()
      .get(
        "/api/shop/user-search-products?minprice=10&maxprice=100&category=Cosmetics&name=l"
      )
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        done(error);
      });
  });
});

describe("sellerViewSpecificProduct", () => {
  let req: Partial<ExtendRequest>;
  let res: Partial<Response>;
  let findProductStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: { id: "test-product-id" },
      shop: { id: "test-shop-id" },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };

    findProductStub = sinon.stub(productRepositories, "sellerGetProductById");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should fetch product successfully", async () => {
    const productData = { id: "test-product-id", name: "Test Product" };
    findProductStub.resolves(productData);

    await productController.sellerGetProduct(
      req as ExtendRequest,
      res as Response
    );
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Product fetched successfully.",
      data: productData,
    });
  });

  it("should handle errors", async () => {
    const error = new Error("Something went wrong");
    findProductStub.rejects(error);

    await productController.sellerGetProduct(
      req as ExtendRequest,
      res as Response
    );
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  });
});

describe("userGetProduct", () => {
  let req;
  let res;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { id: "product-id" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return product details when product is found", async () => {
    const mockProduct = {
      id: "product-id",
      name: "Product Name",
      price: 100,
      description: "Product Description",
    };

    sandbox.stub(productRepositories, "findProductById").resolves(mockProduct);

    await productController.userGetProduct(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Products is fetched successfully.",
      product: mockProduct,
    });
  });

  it("should handle errors properly", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(productRepositories, "findProductById").throws(error);

    await productController.userGetProduct(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  });
});

describe("buyerAddProductToWishList", () => {
  let mockReq: any;
  let mockRes: Partial<Response>;
  let addProductToWishListStub: SinonStub;

  beforeEach(() => {
    mockReq = {
      params: { id: "validProductId" },
      user: { id: "validUserId" },
    };
    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as Partial<Response>;

    addProductToWishListStub = sinon.stub(
      productRepositories,
      "addProductToWishList"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should add product to wishlist successfully", async () => {
    const mockProduct = {
      productId: "validProductId",
      userId: "validUserId",
    };
    addProductToWishListStub.resolves(mockProduct);

    await productController.buyerAddProductToWishList(
      mockReq,
      mockRes as Response
    );

    expect(mockRes.status).to.have.been.calledWith(httpStatus.OK);
  });

  it("should handle internal server error", async () => {
    const errorMessage = "Database error";
    addProductToWishListStub.rejects(new Error(errorMessage));

    await productController.buyerAddProductToWishList(
      mockReq,
      mockRes as Response
    );

    expect(mockRes.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(mockRes.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    });
  });
});

describe("isProductExistToWishlist Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let findProductfromWishListStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: { id: "productId" },
      user: { id: "userId" } as any,
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as Partial<Response>;
    next = sinon.stub() as unknown as NextFunction;
    findProductfromWishListStub = sinon.stub(
      productRepositories,
      "findProductfromWishList"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 200 and product data if product exists in wishlist", async () => {
    const product = { id: "productId", name: "Product Name" };
    findProductfromWishListStub.resolves(product);

    await isProductExistToWishlist(req as Request, res as Response, next);

    expect(findProductfromWishListStub).to.have.been.calledWith(
      "productId",
      "userId"
    );
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      message: "Product is added to wishlist successfully.",
      data: { product },
    });
    expect(next).not.to.have.been.called;
  });

  it("should call next if product does not exist in wishlist", async () => {
    findProductfromWishListStub.resolves(null);

    await isProductExistToWishlist(req as Request, res as Response, next);

    expect(findProductfromWishListStub).to.have.been.calledWith(
      "productId",
      "userId"
    );
    expect(next).to.have.been.called;
    expect(res.status).not.to.have.been.called;
    expect(res.json).not.to.have.been.called;
  });

  it("should return 500 if an error occurs", async () => {
    const errorMessage = "Internal Server Error";
    findProductfromWishListStub.rejects(new Error(errorMessage));

    await isProductExistToWishlist(req as Request, res as Response, next);

    expect(findProductfromWishListStub).to.have.been.calledWith(
      "productId",
      "userId"
    );
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
    });
    expect(next).not.to.have.been.called;
  });
});
describe("Wishlist Middlewares", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let findProductFromWishListByUserIdStub: SinonStub;
  let findProductfromWishListStub: SinonStub;

  beforeEach(() => {
    req = {
      user: { id: "userId" },
      params: { id: "productId" },
    } as any;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as Partial<Response>;
    next = sinon.stub() as unknown as NextFunction;
    findProductFromWishListByUserIdStub = sinon.stub(
      productRepositories,
      "findProductFromWishListByUserId"
    );
    findProductfromWishListStub = sinon.stub(
      productRepositories,
      "findProductfromWishList"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("isUserWishlistExist Middleware", () => {
    it("should return 404 if no wishlist is found", async () => {
      findProductFromWishListByUserIdStub.resolves(null);

      await isUserWishlistExist(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({
        message: "No wishlist Found",
      });
      expect(next).not.to.have.been.called;
    });

    it("should return 404 if wishlist is an empty array", async () => {
      findProductFromWishListByUserIdStub.resolves([]);

      await isUserWishlistExist(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({
        message: "No wishlist Found",
      });
      expect(next).not.to.have.been.called;
    });

    it("should call next if wishlist is found", async () => {
      const wishList = [{ id: "item1" }];
      findProductFromWishListByUserIdStub.resolves(wishList);

      await isUserWishlistExist(req as Request, res as Response, next);

      expect(next).to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });

    it("should return 500 if an error occurs", async () => {
      const errorMessage = "Internal server error";
      findProductFromWishListByUserIdStub.rejects(new Error(errorMessage));

      await isUserWishlistExist(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
      expect(next).not.to.have.been.called;
    });
  });

  describe("isUserWishlistExistById Middleware", () => {
    it("should return 404 if product is not found in wishlist", async () => {
      findProductfromWishListStub.resolves(null);

      await isUserWishlistExistById(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({
        message: "Product Not Found From WishList",
      });
      expect(next).not.to.have.been.called;
    });

    it("should call next if product is found in wishlist", async () => {
      const product = { id: "productId" };
      findProductfromWishListStub.resolves(product);

      await isUserWishlistExistById(req as Request, res as Response, next);

      expect(next).to.have.been.called;
      expect(res.status).not.to.have.been.called;
      expect(res.json).not.to.have.been.called;
    });

    it("should return 500 if an error occurs", async () => {
      const errorMessage = "Internal server error";
      findProductfromWishListStub.rejects(new Error(errorMessage));

      await isUserWishlistExistById(req as Request, res as Response, next);

      expect(res.status).to.have.been.calledWith(
        httpStatus.INTERNAL_SERVER_ERROR
      );
      expect(res.json).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: errorMessage,
      });
      expect(next).not.to.have.been.called;
    });
  });
});

describe("Wishlist Routes", () => {
  let deleteAllWishListByUserIdStub: SinonStub;
  let deleteProductFromWishListByIdStub: SinonStub;

  beforeEach(() => {
    deleteAllWishListByUserIdStub = sinon.stub(
      productRepositories,
      "deleteAllWishListByUserId"
    );
    deleteProductFromWishListByIdStub = sinon.stub(
      productRepositories,
      "deleteProductFromWishListById"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("buyerDeleteAllProductFromWishlist", () => {
    it("should clear all products from wishlist", async () => {
      deleteAllWishListByUserIdStub.resolves();
      const req = { user: { id: "user-id" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await productController.buyerDeleteAllProductFromWishlist(
        req as any,
        res as any
      );
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Your wishlist is cleared successfully.",
        })
      ).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      const errorMessage = "Internal server error";
      deleteAllWishListByUserIdStub.rejects(new Error(errorMessage));
      const req = { user: { id: "user-id" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await productController.buyerDeleteAllProductFromWishlist(
        req as any,
        res as any
      );
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Internal server error",
          error: errorMessage,
        })
      ).to.be.true;
    });
  });

  describe("buyerDeleteProductFromWishList", () => {
    it("should remove a product from wishlist", async () => {
      deleteProductFromWishListByIdStub.resolves();
      const req = {
        params: { id: "product-id" },
        user: { id: "user-id" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await productController.buyerDeleteProductFromWishList(
        req as any,
        res as any
      );
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "The product  removed from wishlist successfully.",
        })
      ).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      const errorMessage = "Internal server error";
      deleteProductFromWishListByIdStub.rejects(new Error(errorMessage));
      const req = {
        params: { id: "product-id" },
        user: { id: "user-id" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      await productController.buyerDeleteProductFromWishList(
        req as any,
        res as any
      );
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Internal server error",
          error: errorMessage,
        })
      ).to.be.true;
    });
  });
});

describe("updateExpiredProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let productFindAllStub: sinon.SinonStub;
  let productUpdateStub: sinon.SinonStub;
  let shopFindAllStub: sinon.SinonStub;
  let userFindAllStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };

    productFindAllStub = sinon.stub(Product, "findAll");
    productUpdateStub = sinon.stub();
    shopFindAllStub = sinon.stub(Shop, "findAll");
    userFindAllStub = sinon.stub(User, "findAll");

    Product.prototype.update = productUpdateStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update expired products and send emails to the respective users", async () => {
    const expiredProducts = [
      {
        id: "productId1",
        shopId: "shopId1",
        name: "Product1",
        update: productUpdateStub,
      },
      {
        id: "productId2",
        shopId: "shopId2",
        name: "Product2",
        update: productUpdateStub,
      },
    ];

    const shops = [
      { id: "shopId1", userId: "userId1" },
      { id: "shopId2", userId: "userId2" },
    ];

    const users = [
      { id: "userId1", email: "user1@example.com", firstName: "User1" },
      { id: "userId2", email: "user2@example.com", firstName: "User2" },
    ];

    productFindAllStub.onFirstCall().resolves(expiredProducts);
    shopFindAllStub.resolves(shops);
    userFindAllStub.resolves(users);

    await updateExpiredProducts();

    expect(productFindAllStub).to.have.been.calledOnce;
    expect(productUpdateStub).to.have.been.calledTwice;
    expect(shopFindAllStub).to.have.been.calledOnce;
    expect(userFindAllStub).to.have.been.calledOnce;
    expect(res.status).not.to.have.been.called;
    expect(res.json).not.to.have.been.called;
  });

  it("should return 500 if an error occurs", async () => {
    productFindAllStub.rejects(new Error("Internal Server Error"));

    await updateExpiredProducts();
    expect(productFindAllStub).to.have.been.calledOnce;
  });
});

describe("buyerViewWishLists", () => {
  let findProductFromWishListByUserIdStub: SinonStub;

  beforeEach(() => {
    findProductFromWishListByUserIdStub = sinon.stub(
      productRepositories,
      "findProductFromWishListByUserId"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should fetch wishlist successfully", async () => {
    const mockProducts = [{ id: 1, name: "Product 1", price: 100 }];
    findProductFromWishListByUserIdStub.resolves(mockProducts);

    const req = {
      user: { id: 1 },
    } as ExtendRequest;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response;

    await productController.buyerViewWishLists(req, res);

    expect(res.status).to.have.been.calledOnceWith(httpStatus.OK);
    expect(res.json).to.have.been.calledOnceWith({
      message: "WishList is fetched successfully.",
      data: { product: mockProducts },
    });
    expect(findProductFromWishListByUserIdStub).to.have.been.calledOnceWith(1);
  });

  it("should handle errors in fetching wishlist", async () => {
    const errorMessage = "Something went wrong";
    findProductFromWishListByUserIdStub.rejects(new Error(errorMessage));

    const req = {
      user: { id: 1 },
    } as ExtendRequest;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response;

    await productController.buyerViewWishLists(req, res);

    expect(res.status).to.have.been.calledOnceWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledOnceWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    });
  });
});
describe("buyerViewWishList", () => {
  let findProductfromWishListStub: SinonStub;

  beforeEach(() => {
    findProductfromWishListStub = sinon.stub(
      productRepositories,
      "findProductfromWishList"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should fetch wishlist successfully", async () => {
    const mockProducts = [{ id: 1, name: "Product 1", price: 100 }];
    findProductfromWishListStub.resolves(mockProducts);

    const req = {
      params: { id: "1" },
      user: { id: 1 },
    } as unknown as ExtendRequest;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response;

    await productController.buyerViewWishList(req, res);
    expect(res.status).to.have.been.calledOnceWith(httpStatus.OK);
    expect(res.json).to.have.been.calledOnceWith({
      message: "WishList is fetched successfully.",
      data: { product: mockProducts },
    });
    expect(findProductfromWishListStub).to.have.been.calledOnceWith("1", 1);
  });

  it("should handle errors in fetching wishlist", async () => {
    const errorMessage = "Something went wrong";
    findProductfromWishListStub.rejects(new Error(errorMessage));

    const req = {
      params: { id: "1" },
      user: { id: 1 },
    } as unknown as ExtendRequest;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    } as unknown as Response;

    await productController.buyerViewWishList(req, res);

    expect(res.status).to.have.been.calledOnceWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledOnceWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: errorMessage,
    });
  });
});
