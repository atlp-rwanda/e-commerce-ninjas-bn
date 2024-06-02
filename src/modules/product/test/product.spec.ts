/* eslint-disable @typescript-eslint/no-explicit-any */
import chai,{expect} from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import Users from "../../../databases/models/users";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import Products from "../../../databases/models/products";
import Collection from "../../../databases/models/collection";
import { fileFilter } from "../../../helpers/multer";
import { isCollectionExist, isProductExist, transformFilesToBody } from "../../../middlewares/validation";
import sinon from "sinon";
import productRepositories from "../repositories/productRepositories";
import httpStatus from "http-status";
import Session from "../../../databases/models/session";

chai.use(chaiHttp);
const router = () => chai.request(app);
const imagePath = path.join(__dirname, "../../../__test__/images/69180880-2138-11eb-8b06-03db3ef1abad.jpeg");
const imageBuffer = fs.readFileSync(imagePath)
describe("Product and Collection API Tests", () => {

    let token:string;
    before((done) => {
      router()
        .post("/api/auth/login")
        .send({ email: "paccy509@gmail.com", password: "$321!Pass!123$" })
        .end((err, res)=>{
            token = res.body.data.token;
            done(err);
        })
    });

    after(async () => {
      await Users.destroy({
        where: {
          role: {
            [Op.ne]: "admin"
          }
        }
      });
      await Products.destroy({
        where:{}
      });
      await Collection.destroy({
        where:{}
      });
      await Session.destroy({
        where:{}
      })
    });
  
    describe("POST /api/collection/create-collection", () => {
      it("should create a collection successfully", (done) => {
       router()
          .post("/api/collection/create-collection")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "New Collection",
            description: "A new collection description"
          })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message", "Collection created successfully");
            expect(res.body.data).to.include({ name: "New Collection", description: "A new collection description" });
            done();
          });
      });
  
      it("should return a validation error when name is missing", (done) => {
       router()
          .post("/api/collection/create-collection")
          .set("Authorization", `Bearer ${token}`)
          .send({ description: "A new collection description" })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("status", 400);
            expect(res.body).to.have.property("message", "Name is required");
            done();
          });
      });
    });
  
    describe("POST /api/collection/create-product/:id", () => {
      let collectionId:string;
      before((done) => {
        router()
          .post("/api/collection/create-collection")
          .set("Authorization", `Bearer ${token}`)
          .send({ name: "Product Collection", description: "Description for product collection" })
          .end((err, res) => {
              collectionId = res.body.data.id;
              done(err);
          })
      });
  
      it("should create a product successfully", (done) => {
        router()
          .post(`/api/collection/create-product/${collectionId}`)
          .set("Authorization", `Bearer ${token}`)
          .field("name", "New Product")
          .field("description", "A new product description")
          .field("price", "99.99")
          .field("category", "Electronics")
          .field("quantity", "10")
          .field("bonus", "10%")
          .field("discount", "10%")
          .field("expiryDate", "2040-4-4")
          .attach("images", imageBuffer,"69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
          .attach("images", imageBuffer,"69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
          .attach("images", imageBuffer,"69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
          .attach("images", imageBuffer,"69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message", "Product created successfully");
            expect(res.body.data).to.include({ name: "New Product", description: "A new product description" });
            done();
          });
      });
  
      it("should return a validation error when images are missing", (done) => {
       router()
          .post(`/api/collection/create-product/${collectionId}`)
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

describe("isProductExist Middleware", () => {
  it("should handle errors and return 500 status", async () => {
      const req = {
          user: { id: "123" },
          params: { id: "456" },
          body: { name: "Test Product" }
      } as any;
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      } as any;
      const next = sinon.spy();

      sinon.stub(productRepositories, "findItemByAttributes").throws(new Error("Database error"));

      await isProductExist(req, res, next);

      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
      expect(res.json.calledWith({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Database error"
      })).to.be.true;

      (productRepositories.findItemByAttributes as sinon.SinonStub).restore();
  });
});

describe("isCollectionExist Middleware", () => {
  it("should handle errors and return 500 status", async () => {
      const req = {
          user: { id: "123" },
          body: { name: "Test Collection" }
      } as any;
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      } as any;
      const next = sinon.spy();

      sinon.stub(productRepositories, "findByModelAndAttributes").throws(new Error("Database error"));

      await isCollectionExist(req, res, next);

      expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
      expect(res.json.calledWith({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Database error"
      })).to.be.true;

      (productRepositories.findByModelAndAttributes as sinon.SinonStub).restore();
  });
});
