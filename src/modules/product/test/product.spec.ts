/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import Users from "../../../databases/models/users";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Products from "../../../databases/models/products";
import Shops from "../../../databases/models/shops";
import { fileFilter } from "../../../helpers/multer";
import { isProductExist, isShopExist, transformFilesToBody } from "../../../middlewares/validation";
import sinon from "sinon";
import productRepositories from "../repositories/productRepositories";
import httpStatus from "http-status";
import Session from "../../../databases/models/session";
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
      .send({ email: "paccy5090@gmail.com", password: "$321!Pass!123$" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      })
  });

  describe("POST /api/shop/create-shop", () => {
    it("should create a Shop successfully", (done) => {
      router()
        .post("/api/shop/create-shop")
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
        .post("/api/shop/create-shop")
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
        .post("/api/shop/create-shop")
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

  describe("POST /api/shop/create-product", () => {
    let productId:string;
    it("should create a product successfully", (done) => {
      router()
        .post("/api/shop/create-product")
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
        .post("/api/shop/create-product")
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

describe("internal server error", () => {
  let token: string = null;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "dj@gmail.com", password: "$321!Pass!123$" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      })
  })
  after(async () => {
    await Users.destroy({
      where: {
        role: {
          [Op.ne]: "admin"
        }
      }
    });
    await Products.destroy({
      where: {}
    });
    await Shops.destroy({
      where: {}
    });
    await Session.destroy({
      where: {}
    })
  });
  it("should handle errors and return 500 status", (done) => {
    sinon.stub(productRepositories, "createShop").throws(new Error("Internal Server Error"))
    router()
      .post("/api/shop/create-shop")
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

  describe("createProduct", () => {
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

          await productController.createProduct(req, res);

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