import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import db from "../../../databases/models";
import { isUserExist } from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import { Request, Response } from "express";
chai.use(chaiHttp);
const router = () => chai.request(app);
const { Users } = db;

describe("User Test Cases", () => {
  it("should return Password must contain both letters and numbers", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        firstName: "TestUser",
        lastName: "TestUser",
        email: "usertesting@gmail.com",
        phone: 123456789,
        password: "TestUser@123",
        gender: "male",
        language: "English",
        currency: "USD",
        birthDate: "2000-12-12",
        role: "buyer"
      })
      .end((error, response) => {
        expect(response.status).equal(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });

  it("Should be able to register new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        firstName: "TestUser",
        lastName: "TestUser",
        email: "usertesting@gmail.com",
        phone: 123456789,
        password: "TestUser123",
        gender: "male",
        language: "English",
        currency: "USD",
        birthDate: "2000-12-12",
        role: "buyer"
      })
      .end((error, response) => {
        expect(response.status).equal(200);
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
});

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
    const mockUser = { email: "usertesting@gmail.com" };
    sinon.stub(authRepositories, "findUserByEmail").resolves(mockUser);
    router()
      .post("/auth/register")
      .send({ email: "usertesting@gmail.com" })
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
      .send({ email: "usertesting@gmail.com" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("message");
        done(err);
      });
  });

  it("should call next if user does not exist", (done) => {
    sinon.stub(authRepositories, "findUserByEmail").resolves(null);

    router()
      .post("/auth/register")
      .send({ email: "newuser@gmail.com" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "success");
        done(err);
      });
  });
});

describe("Register User Error Handling", () => {
  it("should return internal server error if userRepositories.registerUser throws an error", (done) => {
    const registerUserStub = sinon.stub(authRepositories, "registerUser").throws(new Error("Test Error"));

    chai.request(app)
      .post("/api/auth/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: 123456789,
        password: "Password123",
        gender: "male",
        language: "English",
        currency: "USD",
        birthDate: "2000-12-12",
        role: "buyer"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("error");
        registerUserStub.restore();

        done();
      });
  });
});