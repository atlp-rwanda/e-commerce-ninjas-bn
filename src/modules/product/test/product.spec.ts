/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import path from "path";
import fs from "fs";
import { fileFilter } from "../../../helpers/multer";
import { isProductExist, isShopExist, transformFilesToBody } from "../../../middlewares/validation";
import sinon from "sinon";
import productRepositories from "../repositories/productRepositories";
import httpStatus from "http-status";
import productController from "../controller/productController";
import userRepositories from "../../user/repository/userRepositories";
import userControllers from "../../user/controller/userControllers";
import authRepositories from "../../auth/repository/authRepositories";

chai.use(chaiHttp);
const router = () => chai.request(app);
const imagePath = path.join(__dirname, "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg");
const imageBuffer = fs.readFileSync(imagePath)
describe("Product and Shops API Tests", () => {

  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "dj@gmail.com", password: "Password@123" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      })
  });

  describe("POST /api/shop/seller-create-shop", () => {
    it("should create a Shop successfully", (done) => {
      router()
        .post("/api/shop/seller-create-shop")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New Shops",
          description: "A new Shops description"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message", "Shop created successfully");
          expect(res.body.data.shop).to.include({ name: "New Shops", description: "A new Shops description" });
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
          description: "A new Shops description"
        })
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.BAD_REQUEST);
          expect(res.body).to.have.property("message", "Already have a shop.");
          expect(res.body).to.have.property("data");
          done();
        });
    });
  });

  describe("POST /api/shop/seller-create-product", () => {
    let productId:string;
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
        .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
        .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
        .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
        .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
        .end((err, res) => {
          expect(res).to.have.status(httpStatus.CREATED);
          expect(res.body).to.have.property("message", "Product created successfully");
          expect(res.body.data.product).to.include({ name: "New Product", description: "A new product description" });
          productId = res.body.data.product.id
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
          expect(res.body).to.have.property("message", "Images must have at least 4 items");
          done();
        });
    });

    it("should  delete items in collection", (done)=>{
      router()
      .delete(`/api/shop/seller-delete-product/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((error,response)=>{
        expect(response.status).to.be.equal(httpStatus.OK);
        expect(response.body).to.have.property("message", "Product deleted successfully");
        done(error);
      })
    })
  });
  describe("Multer Middleware", () => {
    it("should return an error if a non-image file is uploaded", (done) => {
      const req = {} as any;
      const file = {
        originalname: "test.txt"
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
})

describe("transformFilesToBody Middleware", () => {
  it("should return 400 if no files are provided", () => {
    const req = {
      files: null
    } as any;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as any;
    const next = sinon.spy();

    transformFilesToBody(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({
      status: 400,
      message: "Images are required"
    })).to.be.true;
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
      })
  });


  it("should return statistics of Seller in specified timeframe", (done) => {
    router()
      .post("/api/product/seller-statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31"
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
      .post("/api/product/seller-statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31"
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
      })
  })

  it("should handle errors and return 500 status", (done) => {
    sinon.stub(productRepositories, "createShop").throws(new Error("Internal Server Error"))
    router()
      .post("/api/shop/seller-create-shop")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "International Server Error",
        description: "A new Shops description"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("error", "Internal Server Error");
        done(err);
      });
  });

})

describe("Product Middleware", () => {

  describe("isProductExist", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: { id: 1 },
        body: { name: "Product1" }
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

    it("should return 404 if no shop is found", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").resolves(null);

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.NOT_FOUND, message: "Not shop found." });
    });

    it("should return 400 if the product already exists", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").resolves({ id: 1 });
      sinon.stub(productRepositories, "findByModelsAndAttributes").resolves(true);

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.BAD_REQUEST, message: "Please update the quantities." });
    });

    it("should call next if product does not exist", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").resolves({ id: 1 });
      sinon.stub(productRepositories, "findByModelsAndAttributes").resolves(false);

      await isProductExist(req, res, next);

      expect(req.shop).to.deep.equal({ id: 1 });
      expect(next).to.have.been.called;
    });

    it("should return 500 on error", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").throws(new Error("Internal Server Error"));

      await isProductExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
    });
  });

  describe("isShopExist", () => {
    let req, res, next;

    beforeEach(() => {
      req = { user: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
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
      sinon.stub(productRepositories, "findShopByAttributes").resolves({ id: 1 });

      await isShopExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.BAD_REQUEST, message: "Already have a shop.", data: { shop: { id: 1 } } });
    });

    it("should return 500 on error", async () => {
      sinon.stub(productRepositories, "findShopByAttributes").throws(new Error("Internal Server Error"));

      await isShopExist(req, res, next);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
    });
  });
});

describe("Product Controller", () => {

  describe("sellerCreateProduct", () => {
      let req, res;

    beforeEach(() => {
      req = {
        shop: { id: 1 },
        files: [{ filename: "image1.jpg" }, { filename: "image2.jpg" }],
        body: { name: "Product1" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      }
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(req.files, "map").throws(new Error("File upload error"));

          await productController.sellerCreateProduct(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, error: "File upload error" });
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
        json: sinon.stub().returnsThis()
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(userRepositories, "getAllUsers").throws(new Error("Internal Server Error"));

      await userControllers.adminGetUsers(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
    });
  });

  describe("adminGetUser", () => {
    let req, res;

    beforeEach(() => {
      req = { params: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(authRepositories, "findUserByAttributes").throws(new Error("Internal Server Error"));

      await userControllers.adminGetUser(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
    });
  });

  describe("getUserDetails", () => {
    let req, res;

    beforeEach(() => {
      req = { user: { id: 1 } };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(authRepositories, "findUserByAttributes").throws(new Error("Internal Server Error"));

      await userControllers.getUserDetails(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).to.have.been.calledWith({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Internal Server Error" });
    });
  });

  describe("updateUserProfile", () => {
    let req, res;

    beforeEach(() => {
      req = {
        user: { id: 1 },
        file: {
          path: "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg",
          filename: "69180880-2138-11eb-8b06-03db3ef1abad.jpeg"
        },
        body: { name: "John Doe" }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle internal server error", async () => {
      sinon.stub(userRepositories, "updateUserProfile").throws(new Error("Internal Server Error"));

      await userControllers.updateUserProfile(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    });
    it("should handle missing required parameter - file", async () => {
      delete req.file;
      await userControllers.updateUserProfile(req, res);

      expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    });

  });
})


describe("Buyer get products - test cases", () => {
  let getAvailableProductsStub;

  afterEach(() => {
    if (getAvailableProductsStub) {
      getAvailableProductsStub.restore();
    }
  });

  it("Should notify if Limit or page not provided", (done) => {
    router().get("/api/shop/all-products")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Page and limit are required");
        done(error);
      });
  });

  it("Should notify if Limit or page is invalid", (done) => {
    router().get("/api/shop/all-products?limit=a&page=-18")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Page and limit must be positive numbers");
        done(error);
      });
  });

  it("Should return Category related products if Category provided", (done) => {
    router().get("/api/shop/all-products?limit=1&page=18&category=Fashion")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");
        done(error);
      });
  });

  it("Should return products when data is ok", (done) => {
    router().get("/api/shop/all-products?limit=1&page=18")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.be.an("array");

        const nextPage = response.body.nextPage;
        const previousPage = response.body.previousPage;

        if (nextPage) {
          expect(+nextPage.page).to.be.a("number");
          expect(+nextPage.limit).to.be.a("number");
        }
        if (previousPage) {
          expect(+previousPage.page).to.be.a("number");
          expect(+previousPage.limit).to.be.a("number");
        }

        done(error);
      });
  });


  it("Should return an internal server error for testing", (done) => {
    getAvailableProductsStub = sinon.stub(productRepositories, "getAvailableProducts").throws(new Error("Internal Server Error for testing"));

    router().get("/api/shop/all-products?limit=1&page=1")
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Internal Server Error for testing");
        done(error);
      });
  });
});



describe("Seller get Products test cases", () => {
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
        email: "seller_test_bon@gmail.com",
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
  it("Should login buyer", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "seller_test_bon@gmail.com",
        password: "$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        sellerToken = response.body.data.token
        console.log(sellerToken)
        done(error);
      });
  })



  it("Should restrict buyer from accessing", (done) => {
    router()
      .get("/api/shop/shop-products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
        expect(response.body).to.be.a("object");
        done(error);
      });
  })
  it("Should update User and return updated user", (done) => {
    router()
      .put(`/api/user/admin-update-role/${buyerId}`)
      .send({ role: "seller" })
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        done(err);
      });
  });

  it("Should notify if Limit or page not provided", (done) => {
    router().get("/api/shop/shop-products")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Page and limit are required");
        done(error);
      });
  });

  it("Should notify if Limit or page is invalid", (done) => {
    router().get("/api/shop/shop-products?limit=a&page=-18")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Page and limit must be positive numbers");
        done(error);
      });
  });

  it("Should notify if No shop for the seller", (done) => {
    router().get("/api/shop/shop-products?limit=1&page=10")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.NOT_FOUND);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error", "Shop doesn't exists");
        done(error);
      });
  });

  it("should create a Shop successfully", (done) => {
    router()
      .post("/api/shop/create-shop")
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        name: "New Shops 1",
        description: "A new Shops description"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Shop created successfully");
        expect(res.body.data.shop).to.include({ name: "New Shops 1", description: "A new Shops description" });
        done();
      });
  });


  it("Should return data successfully", (done) => {
    router().get("/api/shop/shop-products?limit=1&page=10")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        done(error);
      });
  });

  it("Should return paginated data based on page and limit", (done) => {
    router().get("/api/shop/shop-products?limit=1&page=1")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        const nextPage = response.body.nextPage;
        const previousPage = response.body.previousPage;

        if (nextPage) {
          expect(+nextPage.page).to.be.a("number");
          expect(+nextPage.limit).to.be.a("number");
        }
        if (previousPage) {
          expect(+previousPage.page).to.be.a("number");
          expect(+previousPage.limit).to.be.a("number");
        }
        done(error);
      });
  });

  it("Should handle database errors gracefully", (done) => {
    sinon.stub(productRepositories, "getProductsByAttributes").throws(new Error("Database error"));

    router().get("/api/shop/shop-products?limit=1&page=1")
      .set("Authorization", `Bearer ${sellerToken}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("error");
        done();
      });
  });

})








