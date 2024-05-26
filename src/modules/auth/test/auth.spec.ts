import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import fs from "fs"
import path from "path";
import app from "../../..";
import { isUserExist } from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import * as uploadImages from "../../../helpers/uploadImage";



chai.use(chaiHttp);
const router = () => chai.request(app);

const imagePath = path.join(__dirname, "../../../../public/ProjectManagement.jpg");
const filePath = path.join(__dirname, "../../../../public/BUILD.txt");
const fileBuffer = fs.readFileSync(filePath);
const imageBuffer = fs.readFileSync(imagePath)
describe("Authentication Test Cases", () => {
  it("Should be able to register new user", (done) => {
    router()
      .post("/api/auth/register")
      .field("firstName", "TestUser")
      .field("lastName", "TestUser")
      .field("email", "TestUser@example.com")
      .field("phone", 123456789)
      .field("password", "TestUser@123")
      .field("gender", "male")
      .field("language", "english")
      .field("currency", "USD")
      .field("birthDate", "2000-12-12")
      .field("role", "buyer")
      .attach("profilePicture", imageBuffer, "ProjectManagement.jpg")
      .end((error, response) => {
        if (error || response.status !== 200) {
          console.error("Error:", error);
          console.log("Response Body:", response.body);
        }
        expect(response.status).to.equal(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("user");
        expect(response.body).to.have.property("token");
        expect(response.body.user).to.have.property("firstName");
        expect(response.body.user).to.have.property("lastName");
        expect(response.body.user).to.have.property("email");
        expect(response.body.user).to.have.property("phone");
        expect(response.body.user).to.have.property("password");
        expect(response.body.user).to.have.property("role");
        expect(response.body.user).to.have.property("id");
        expect(response.body.user).to.have.property("gender");
        expect(response.body.user).to.have.property("language");
        expect(response.body.user).to.have.property("currency");
        expect(response.body.user).to.have.property("profilePicture");
        expect(response.body.user).to.have.property("birthDate");
        expect(response.body.user).to.have.property("status", true);
        expect(response.body.user).to.have.property("isVerified", false);
        expect(response.body.user).to.have.property("is2FAEnabled", false);
        expect(response.body.user).to.have.property("createdAt");
        expect(response.body.user).to.have.property("updatedAt");
        done(error);
      });
  });

  it("should return validation return message error and 400", (done) => {
    router()
      .post("/api/auth/register")
      .field("firstName", "TestUser")
      .field("lastName", "TestUser")
      .field("email", "TestUser@example.com")
      .field("phone", "8888888")
      .field("password", "TestUser")
      .field("gender", "male")
      .field("language", "english")
      .field("currency", "USD")
      .field("birthDate", "2000-12-12")
      .field("role", "buyer")
      .attach("profilePicture", imageBuffer, "ProjectManagement.jpg")
      .end((error, response) => {
        expect(response.status).equal(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });
})
describe("multer test", () => {
  it("should return fail", (done) => {
    router()
      .post("/api/auth/register")
      .field("firstName", "TestUser")
      .field("lastName", "TestUser")
      .field("email", "TestUser@example.com")
      .field("phone", "8888888")
      .field("password", "TestUser")
      .field("gender", "male")
      .field("language", "english")
      .field("currency", "USD")
      .field("birthDate", "2000-12-12")
      .field("role", "buyer")
      .attach("profilePicture", fileBuffer, "BUILD.txt")
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        done(err);
      });
  })
})

describe("isUserExist Middleware", () => {
  before(() => {
    app.post("/auth/register", isUserExist, (req: Request, res: Response) => {
      res.status(200).json({ message: "success" });
    });
  });

  afterEach(async () => {
    sinon.restore();
    await Users.destroy({ where: {} });
  });

  it("should return user already exists", (done) => {

    router()
      .post("/api/auth/register")
      .field("firstName", "TestUser")
      .field("lastName", "TestUser")
      .field("email", "TestUser@example.com")
      .field("phone", 123456789)
      .field("password", "TestUser@123")
      .field("gender", "male")
      .field("language", "english")
      .field("currency", "USD")
      .field("birthDate", "2000-12-12")
      .field("role", "buyer")
      .attach("profilePicture", imageBuffer, "ProjectManagement.jpg")
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "User already exists.");
        done(err);
      });
  });

  it("should return internal server error", (done) => {
    sinon.stub(authRepositories, "findUserByEmail").throws(new Error("Database error"));
    router()
      .post("/auth/register")
      .field("email", "usertesting@gmail.com")
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("message","Database error");
        done(err);
      });
  });

  it("should call next if user does not exist", (done) => {
    sinon.stub(authRepositories, "findUserByEmail").resolves(null);

    router()
      .post("/auth/register")
      .field("email", "newuser@gmail.com")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "success");
        done(err);
      });
  });
});

describe("POST /api/auth/register error handling", () => {
  let uploadImagesStub: sinon.SinonStub;

  beforeEach(() => {
      uploadImagesStub = sinon.stub(uploadImages, "uploadImages").throws(new Error("Invalid image file"));
  });

  afterEach(() => {
      uploadImagesStub.restore();
  });

  it("should return 500 and an error message when an error occurs", (done) => {
      router()
          .post("/api/auth/register")
          .field("firstName", "TestUser")
          .field("lastName", "TestUser")
          .field("email", "TestUser@example.com")
          .field("phone", 123456789)
          .field("password", "TestUser@123")
          .field("gender", "male")
          .field("language", "english")
          .field("currency", "USD")
          .field("birthDate", "2000-12-12")
          .field("role", "buyer")
          .attach("profilePicture", Buffer.from("image content"), "ProjectManagement.jpg")
          .end((err, res) => {
              if (err) return done(err);
              expect(res.status).to.equal(500);
              expect(res.body).to.have.property("status", 500);
              expect(res.body).to.have.property("message", "Invalid image file");
              done();
          });
  });
});