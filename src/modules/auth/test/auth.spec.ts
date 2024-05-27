/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import { isUserExist } from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import Tokens from "../../../databases/models/tokens";


chai.use(chaiHttp);
const router = () => chai.request(app);
let userId:string;
describe("Authentication Test Cases", () => {
  let verifyToken: string | null = null;

  afterEach(async () => {
    const tokenRecord = await Tokens.findOne();
    if (tokenRecord) {
      verifyToken = tokenRecord.dataValues.verifyToken;
    }
  });

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "user@example.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userId = response.body.data.register.id;
        expect(response.body.message).to.be.a("string");
        done(error);
      });
  });

  it("should verify the user successfully", async () => {
    if (!verifyToken) {
      throw new Error("verifyToken is not set");
    }

    const res = await chai.request(app)
      .get(`/api/auth/${userId}/verify/${verifyToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      status: httpStatus.OK,
      message: " Account verified successfully."
    });
  });

  it("should handle errors during user verification", async () => {

    const errorMessage = "Something went wrong";
    const updateUserVerifiedStub = sinon.stub(authRepositories, "UpdateUserVerified").rejects(new Error(errorMessage));
    const tokenRemoveStub = sinon.stub(authRepositories, "tokenRemove").rejects(new Error(errorMessage));

    const res = await chai.request(app)
      .get(`/api/auth/${userId}/verify/${verifyToken}`);

    expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.body).to.deep.equal({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage
    });

    sinon.assert.calledOnce(updateUserVerifiedStub);
    sinon.assert.notCalled(tokenRemoveStub);
  });

  it("should return validation return message error and 400", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "user@example.com",
        password: "userPassword"
      })
      .end((error, response) => {
        expect(response.status).equal(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });
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
      .send({
        email: "user@example.com",
        password: "userPassword@123"
      })
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
        expect(res.body).to.have.property("message", "Database error");
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
describe("POST /auth/register - Error Handling", () => {
  let registerUserStub: sinon.SinonStub;

  beforeEach(() => {
    registerUserStub = sinon.stub(authRepositories, "registerUser").throws(new Error("Test error"));
  });

  afterEach(() => {
    registerUserStub.restore();
  });

  it("should return 500 and error message when an error occurs", (done) => {
    router()
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password@123" })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.deep.equal({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Test error"
        });
        done(err)
      });
  });
});

describe("Verify User Endpoint", () => {
  it("should return 400 if User not found", (done) => {
    userId = "12345";
    const token = "invalidtoken";
    router().get(`/api/auth/${userId}/verify/${token}`)
      .end((error, res) => {
        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body).to.deep.equal({
          message: "User not found"
        });
        done(error);
      })
  });
});
