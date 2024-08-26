/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
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
  isWishListExist,
  isUserWishlistExist,
  isWishListProductExist,
  isProductOrdered,

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
import db from "../../../databases/models";
import { any } from "joi";
import cartRepositories from "../../cart/repositories/cartRepositories";

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
      .send({ email: "jadowacu@gmail.com", password: "Password@123" })
      .end((err, res) => {
        console.log(res);
        token = res.body.data.token;
        done(err);
      });
  });
  // describe("POST /api/shop/seller-create-shop", () => {
  //   it("should give an error", (done) => {
  //     router()
  //       .get("/api/shop/seller-get-products")
  //       .set("Authorization", `Bearer ${token}`)
  //       .end((err, res) => {
  //         expect(res).to.have.status(404);
  //         done();
  //       });
  //   });

  //   it("should create a Shop successfully", (done) => {
  //     router()
  //       .post("/api/shop/seller-create-shop")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({
  //         name: "New Shops",
  //         description: "A new Shops description",
  //       })
  //       .end((err, res) => {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.have.property(
  //           "message",
  //           "Shop created successfully"
  //         );
  //         expect(res.body.data.shop).to.include({
  //           name: "New Shops",
  //           description: "A new Shops description",
  //         });
  //         done();
  //       });
  //   });

  //   it("should return a validation error when name is missing", (done) => {
  //     router()
  //       .post("/api/shop/seller-create-shop")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ description: "A new Shops description" })
  //       .end((err, res) => {
  //         expect(res).to.have.status(httpStatus.BAD_REQUEST);
  //         expect(res.body).to.have.property("status", httpStatus.BAD_REQUEST);
  //         expect(res.body).to.have.property("message", "Name is required");
  //         done();
  //       });
  //   });

  //   it("should Already have a shop", (done) => {
  //     router()
  //       .post("/api/shop/seller-create-shop")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({
  //         name: "New Shops",
  //         description: "A new Shops description",
  //       })
  //       .end((err, res) => {
  //         expect(res).to.have.status(httpStatus.BAD_REQUEST);
  //         expect(res.body).to.have.property("message", "Already have a shop.");
  //         expect(res.body).to.have.property("data");
  //         done();
  //       });
  //   });
  // });

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

    it("should mark single notifications as read", (done) => {
      router()
        .put(`/api/user/user-mark-notification/${notificationId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.OK);
          expect(res.body).to.have.property("message", "Notification marked as read");
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
          expect(err!.message).to.equal("Only image files are allowed");
          done();
        } catch (error) {
          done(error);
        }
      };

      fileFilter(req, file, cb);
    });
  });
});

// describe("transformFilesToBody Middleware", () => {
//   it("should return 400 if no files are provided", () => {
//     const req = {
//       files: null,
//     } as any;
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     } as any;
//     const next = sinon.spy();

//     transformFilesToBody(req, res, next);

//     expect(res.status.calledWith(400)).to.be.true;
//     expect(
//       res.json.calledWith({
//         status: 400,
//         message: "Images are required",
//       })
//     ).to.be.true;
//   });
// });

describe("Seller test cases", () => {
  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "aimegetz@gmail.com", password: "Password@123" })
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

// describe("internal server error", () => {
//   let token: string;
//   before((done) => {
//     router()
//       .post("/api/auth/login")
//       .send({ email: "seller15@gmail.com", password: "Password@123" })
//       .end((err, res) => {
//         token = res.body.data.token;
//         done(err);
//       });
//   });

//   // it("should handle errors and return 500 status", (done) => {
//   //   sinon
//   //     .stub(productRepositories, "createShop")
//   //     .throws(new Error("Internal Server Error"));
//   //   router()
//   //     .post("/api/shop/seller-create-shop")
//   //     .set("Authorization", `Bearer ${token}`)
//   //     .send({
//   //       name: "International Server Error",
//   //       description: "A new Shops description",
//   //     })
//   //     .end((err, res) => {
//   //       expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
//   //       expect(res.body).to.have.property("message");
//   //       done(err);
//   //     });
//   // });
// });

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
      .send({ email: "ndahimana154@gmail.com", password: "Password@123" })
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
      message: error.message,
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
        message: "File upload error",
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
        email: "ecommerceninjas45@gmail.com",
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
      status: httpStatus.OK,
      message: "Product fetched successfully.",
      data: { product: productData },
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
      message: error.message,
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

    sandbox.stub(productRepositories, "findSingleProductById").resolves(mockProduct);

    await productController.userGetProduct(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.OK,
      message: "Products is fetched successfully.",
      data: { product: mockProduct },
    });
  });

  it("should handle errors properly", async () => {
    const error = new Error("Something went wrong");
    sandbox.stub(productRepositories, "findSingleProductById").throws(error);

    await productController.userGetProduct(req, res);

    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
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



describe('isUserWishlistExist Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        id: 'user-id'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should set the wishlist in req and call next if wishlist exists', async () => {
    const wishlist: any = { id: 'wishlist-id', userId: 'user-id', wishListProducts: [] };
    sinon.stub(productRepositories, 'findWishListByUserId').resolves(wishlist);

    await isUserWishlistExist(req, res, next);

    expect(req.wishList).to.deep.equal(wishlist);
    expect(next.calledOnce).to.be.true;
  });

  it('should return 404 if wishlist does not exist', async () => {
    sinon.stub(productRepositories, 'findWishListByUserId').resolves(null);

    await isUserWishlistExist(req, res, next);

    expect(res.status.calledWith(httpStatus.NOT_FOUND)).to.be.true;
    expect(res.json.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "No wishlist Found"
    })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 500 if an error occurs', async () => {
    const error = new Error('Something went wrong');
    sinon.stub(productRepositories, 'findWishListByUserId').rejects(error);

    await isUserWishlistExist(req, res, next);

    expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    expect(res.json.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    }));
    expect(next).not.to.have.been.called;
  });
});

describe("buyerAddProductToWishList Function", () => {
  let req: any;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: { id: "testProductId" },
      wishList: "testWishListId",
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    statusStub = res.status as sinon.SinonStub;
    jsonStub = res.json as sinon.SinonStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should add product to wishlist successfully", async () => {
    const product: any = { id: "testProductId", name: "Test Product" };
    sinon.stub(productRepositories, "addProductToWishList").resolves(product);

    await productController.buyerAddProductToWishList(req, res as Response);

    expect(productRepositories.addProductToWishList).to.have.been.calledWith({
      productId: "testProductId",
      wishListId: "testWishListId",
    });
    expect(statusStub).to.have.been.calledWith(httpStatus.OK);
    expect(jsonStub).to.have.been.calledWith({
      status: httpStatus.OK,
      message: "Product is added to wishlist successfully.",
      data: { product }
    });
  });

  it("should handle errors and return 500 status", async () => {
    const error = new Error("Test Error");
    sinon.stub(productRepositories, "addProductToWishList").rejects(error);

    await productController.buyerAddProductToWishList(req, res as Response);

    expect(statusStub).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonStub).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  });
});

describe("Product Functions", () => {
  let req: any;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    statusStub = res.status as sinon.SinonStub;
    jsonStub = res.json as sinon.SinonStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("buyerAddProductToWishList", () => {
    beforeEach(() => {
      req = {
        params: { id: "testProductId" },
        wishList: "testWishListId",
      };
    });

    it("should add product to wishlist successfully", async () => {
      const product: any = { id: "testProductId", name: "Test Product" };
      sinon.stub(productRepositories, "addProductToWishList").resolves(product);

      await productController.buyerAddProductToWishList(req, res as Response);

      expect(productRepositories.addProductToWishList).to.have.been.calledWith({
        productId: "testProductId",
        wishListId: "testWishListId",
      });
      expect(statusStub).to.have.been.calledWith(httpStatus.OK);
      expect(jsonStub).to.have.been.calledWith({
        status: httpStatus.OK,
        message: "Product is added to wishlist successfully.",
        data: { product },
      });
    });
    it("should handle errors and return 500 status", async () => {
      const error = new Error("Test Error");
      sinon.stub(productRepositories, "addProductToWishList").rejects(error);

      await productController.buyerAddProductToWishList(req, res as Response);

      expect(statusStub).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(jsonStub).to.have.been.calledWith({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    });
  });

  describe("buyerViewWishLists", () => {
    beforeEach(() => {
      req = {
        wishList: "testWishListId",
      };
    });
    it("should fetch wishlist products successfully", async () => {
      const wishListProducts: any = [{ products: { id: "product1" } }, { products: { id: "product2" } }];
      sinon.stub(productRepositories, "getProductsFromWishlist").resolves(wishListProducts);

      await productController.buyerViewWishListProducts(req, res as Response);


      expect(statusStub).to.have.been.calledWith(httpStatus.OK);

    });
  });

  describe("buyerViewWishList", () => {
    beforeEach(() => {
      req = {
        product: { id: "product1", name: "Test Product" },
      };
    });

    it("should fetch single wishlist product successfully", async () => {
      await productController.buyerViewWishListProduct(req , res as Response);
      expect(statusStub).to.have.been.calledWith(httpStatus.OK);
      expect(jsonStub).to.have.been.calledWith({
        status: httpStatus.OK,
        message: "WishList is fetched successfully.",
        data: { product: { id: "product1", name: "Test Product" } },
      });
    });
  });
});

describe('Wishlist Functions', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('sellerGetProductById', () => {
    it('should return product by shop ID and product ID', async () => {
      const shopId = 'testShopId';
      const productId = 'testProductId';
      const expectedProduct = [{ id: 'product1' }];

      sinon.stub(db.Products, 'findAll').resolves(expectedProduct as any);

      const product = await productRepositories.sellerGetProductById(shopId, productId);

      expect(db.Products.findAll).to.have.been.calledWith({
        where: { shopId, id: productId },
      });
      expect(product).to.equal(expectedProduct);
    });
  });

  describe('createWishList', () => {
    it('should create a wishlist', async () => {
      const body = { userId: 'testUserId' };
      const expectedWishList = { id: 'wishlist1' };

      sinon.stub(db.wishLists, 'create').resolves(expectedWishList as any);

      const wishList = await productRepositories.createWishList(body);

      expect(db.wishLists.create).to.have.been.calledWith(body);
      expect(wishList).to.equal(expectedWishList);
    });
  });

  describe('addProductToWishList', () => {
    it('should add product to wishlist', async () => {
      const body = { productId: 'testProductId', wishListId: 'testWishListId' };
      const expectedWishListProduct = { id: 'wishlistProduct1' };

      sinon.stub(db.wishListProducts, 'create').resolves(expectedWishListProduct as any);

      const wishListProduct = await productRepositories.addProductToWishList(body);

      expect(db.wishListProducts.create).to.have.been.calledWith(body);
      expect(wishListProduct).to.equal(expectedWishListProduct);
    });
  });

  describe('getWishListByUserId', () => {
    it('should return wishlist by user ID', async () => {
      const userId = 'testUserId';
      const expectedWishList = { id: 'wishlist1' };

      sinon.stub(db.wishLists, 'findOne').resolves(expectedWishList as any);

      const wishList = await productRepositories.getWishListByUserId(userId);

      expect(db.wishLists.findOne).to.have.been.calledWith({ where: { userId } });
      expect(wishList).to.equal(expectedWishList);
    });
  });

  describe('getProductsFromWishlist', () => {
    it('should return products from wishlist by wishlist ID', async () => {
      const wishListId = 'testWishListId';
      const expectedProducts = [{ id: 'product1' }, { id: 'product2' }];

      sinon.stub(db.wishListProducts, 'findAll').resolves(expectedProducts as any);

      const products = await productRepositories.getProductsFromWishlist(wishListId);

      expect(db.wishListProducts.findAll).to.have.been.calledWith({
        where: { wishListId },
        include: [
          {
            model: db.Products,
            as: 'products',
            attributes: ['id', 'name', 'price', 'images', 'shopId'],
          },
        ],
      });
      expect(products).to.equal(expectedProducts);
    });
  });

  describe('findProductfromWishList', () => {
    it('should find product from wishlist by product ID and wishlist ID', async () => {
      const productId = 'testProductId';
      const wishListId = 'testWishListId';
      const expectedProduct = { id: 'product1' };

      sinon.stub(db.wishListProducts, 'findOne').resolves(expectedProduct as any);

      const product = await productRepositories.findProductfromWishList(productId, wishListId);

      expect(db.wishListProducts.findOne).to.have.been.calledWith({
        where: { productId, wishListId },
        include: [
          {
            model: db.Products,
            as: 'products',
            attributes: ['id', 'name', 'price', 'images', 'shopId'],
          },
        ],
      });
      expect(product).to.equal(expectedProduct);
    });
  });

  describe('findWishListByUserId', () => {
    it('should find wishlist by user ID', async () => {
      const userId = 'testUserId';
      const expectedWishList = { id: 'wishlist1' };

      sinon.stub(db.wishLists, 'findOne').resolves(expectedWishList as any);

      const wishList = await productRepositories.findWishListByUserId(userId);


      expect(wishList).to.equal(expectedWishList);
    });
  });




  describe('Middleware Functions', () => {
    let req: any;
    let res: Partial<Response>;
    let next: any;

    beforeEach(() => {
      req = {
        params: {},
        user: {},
        wishList: null,
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

    describe('isWishListProductExist', () => {
      it('should return product if it exists in wishlist', async () => {
        const productId = 'testProductId';
        const wishListId = 'testWishListId';
        const wishListProduct = { id: 'wishlistProduct1' };

        req.params.id = productId;
        req.wishList = wishListId;

        sinon.stub(productRepositories, 'findProductfromWishList').resolves(wishListProduct as any);

        await isWishListProductExist(req, res as Response, next);

        expect(res.status).to.have.been.calledWith(httpStatus.OK);
        expect(res.json).to.have.been.calledWith({
          message: 'Product is added to wishlist successfully.',
          data: { wishListProduct }
        });
        expect(next).to.not.have.been.called;
      });

      it('should call next if product does not exist in wishlist', async () => {
        const productId = 'testProductId';
        const wishListId = 'testWishListId';

        req.params.id = productId;
        req.wishList = wishListId;

        sinon.stub(productRepositories, 'findProductfromWishList').resolves(null);

        await isWishListProductExist(req, res as Response, next);

        expect(next).to.have.been.called;
      });

      it('should handle errors and return 500 status', async () => {
        const errorMessage = 'Internal server error';

        sinon.stub(productRepositories, 'findProductfromWishList').rejects(new Error(errorMessage));

        await isWishListProductExist(req, res as Response, next);

        expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).to.have.been.calledWith({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage
        });
        expect(next).to.not.have.been.called;
      });
    });

    describe('isUserWishlistExist', () => {
      it('should return 404 if wishlist does not exist', async () => {
        const userId = 'testUserId';

        req.user.id = userId;

        sinon.stub(productRepositories, 'findWishListByUserId').resolves(null);

        await isUserWishlistExist(req, res as Response, next);

        expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
        expect(res.json).to.have.been.calledWith({
          status: httpStatus.NOT_FOUND,
          message: 'No wishlist Found'
        });
        expect(next).to.not.have.been.called;
      });

      it('should set req.wishList and call next if wishlist exists', async () => {
        const userId = 'testUserId';
        const wishList = { id: 'wishlist1' };

        req.user.id = userId;

        sinon.stub(productRepositories, 'findWishListByUserId').resolves(wishList as any);

        await isUserWishlistExist(req, res as Response, next);
        expect(next).to.have.been.called;
      });

      it('should handle errors and return 500 status', async () => {
        const errorMessage = 'Internal server error';

        sinon.stub(productRepositories, 'findWishListByUserId').rejects(new Error(errorMessage));

        await isUserWishlistExist(req, res as Response, next);

        expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.json).to.have.been.calledWith({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage
        });
        expect(next).to.not.have.been.called;
      });
    });
  })
})
describe("isProductOrdered", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { id: "product-id" },
      user: { id: "user-id" }
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

  it("should proceed to the next middleware if the product is ordered and completed", async () => {
    const mockCart = { status: "completed" };
    sandbox.stub(cartRepositories, "getCartsByProductId").resolves(mockCart);

    await isProductOrdered(req, res, next);

    expect(cartRepositories.getCartsByProductId).to.have.been.calledOnceWith("product-id", "user-id");
    expect(req.cart).to.equal(mockCart);
    expect(next).to.have.been.calledOnce;
  });

  it("should return 404 if the product is not ordered", async () => {
    sandbox.stub(cartRepositories, "getCartsByProductId").resolves(null);

    await isProductOrdered(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "Product is not ordered"
    });
  });

  it("should return 400 if the order is not completed", async () => {
    const mockCart = { status: "pending" };
    sandbox.stub(cartRepositories, "getCartsByProductId").resolves(mockCart);

    await isProductOrdered(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.BAD_REQUEST,
      message: "Order is not Completed"
    });
  });

  it("should return 500 if there is a server error", async () => {
    const errorMessage = "Server error";
    sandbox.stub(cartRepositories, "getCartsByProductId").throws(new Error(errorMessage));

    await isProductOrdered(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage
    });
  });
});

describe("buyerReviewProduct", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: { rating: 5, feedback: "Great product!" },
      params: { id: "product-id" },
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

  it("should create a product review successfully", async () => {
    const mockReview = { id: "review-id", rating: 5, feedback: "Great product!" };
    sandbox.stub(productRepositories, "userCreateReview").resolves(mockReview);

    await productController.buyerReviewProduct(req, res);

    expect(productRepositories.userCreateReview).to.have.been.calledOnceWith({
      rating: 5,
      feedback: "Great product!",
      productId: "product-id",
      userId: "user-id"
    });
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.OK,
      message: "Product reviewed successfully",
      data: { productReview: mockReview }
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "An error occurred";
    sandbox.stub(productRepositories, "userCreateReview").throws(new Error(errorMessage));

    await productController.buyerReviewProduct(req, res);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage
    });
  });
});