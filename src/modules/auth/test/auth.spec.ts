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
import Session from "../../../databases/models/session";
import {
  sendVerificationEmail,
  transporter
} from "../../../services/sendEmail";

chai.use(chaiHttp);
const router = () => chai.request(app);

let userId: number = 0;
let verifyToken: string | null = null;

describe("Authentication Test Cases", () => {
  let token;

  afterEach(async () => {
    const tokenRecord = await Session.findOne({ where: { userId } });
    if (tokenRecord) {
      verifyToken = tokenRecord.dataValues.token;
    }
  });

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userId = response.body.data.user.id;
        expect(response.body).to.have.property(
          "message",
          "Account created successfully. Please check email to verify account."
        );
        done(error);
      });
  });

  it("should verify the user successfully", (done) => {
    if (!verifyToken) {
      throw new Error("verifyToken is not set");
    }

    router()
      .get(`/api/auth/verify-email/${verifyToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.OK);
        expect(res.body).to.have.property(
          "message",
          "Account verified successfully, now login."
        );
        done(err);
      });
  });

  it("should return validation error and 400", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "user@example.com",
        password: "userPassword"
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("message");
        done(error);
      });
  });

  it("Should be able to login a registered user", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
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

  it("Should be able to logout user", (done) => {
    router()
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.have.property("message", "Successfully logged out");
        done(err);
      });
  });

  
  it("Should be able to login a registered user", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123",
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

  it("Should return error on logout", (done) => {
    sinon
      .stub(authRepositories, "destroySession")
      .throws(new Error("Database Error"));
    router()
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("message", "Internal Server error");
        done(err);
      });
  });
  
  it("should return internal server error on login", (done) => {
    sinon
      .stub(authRepositories, "createSession")
      .throws(new Error("Database error"));
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        done(err);
      });
  });

  it("Should return validation error when no email or password given", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "user@example.com"
      })
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        done(error);
      });
  });

  it("Should not be able to login user with invalid Email", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "fakeemail@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property(
          "message",
          "Invalid Email or Password"
        );
        done(error);
      });
  });

  it("Should not be able to login user with invalid Password", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "fakePassword@123"
      })
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property(
          "message",
          "Invalid Email or Password"
        );
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
  });

  it("should return user already exists", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "Account already exists.");
        done(err);
      });
  });

  it("should return 'Account already exists. Please verify your account' if user exists and is not verified", (done) => {
    const mockUser = Users.build({
      id: 1,
      email: "user@example.com",
      password: "hashedPassword",
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    sinon.stub(authRepositories, "findUserByAttributes").resolves(mockUser);

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
        expect(res.body).to.have.property(
          "message",
          "Account already exists. Please verify your account"
        );
        done(err);
      });
  });

  it("should return internal server error", (done) => {
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .throws(new Error("Database error"));
    router()
      .post("/auth/register")
      .send({ email: "usertesting@gmail.com" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "status",
          httpStatus.INTERNAL_SERVER_ERROR
        );
        expect(res.body).to.have.property("message", "Database error");
        done(err);
      });
  });

  it("should return internal server error on login", (done) => {
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .throws(new Error("Database error"));
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        done(err);
      });
  });

  it("should call next if user does not exist", (done) => {
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

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
    registerUserStub = sinon
      .stub(authRepositories, "createUser")
      .throws(new Error("Test error"));
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
        done(err);
      });
  });
});

describe("isAccountVerified Middleware", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return 'Account not found' if user is not found", (done) => {
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    router()
      .post("/api/auth/send-verify-email")
      .send({ email: "nonexistent@example.com" })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("message", "Account not found.");
        done(err);
      });
  });

  it("should return 'Account already verified' if user is already verified", (done) => {
    const mockUser = Users.build({
      id: 1,
      email: "user@example.com",
      password: "hashedPassword",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    sinon.stub(authRepositories, "findUserByAttributes").resolves(mockUser);

    router()
      .post("/api/auth/send-verify-email")
      .send({ email: "user@example.com" })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property(
          "message",
          "Account already verified."
        );
        done(err);
      });
  });
});

describe("Authentication Test Cases", () => {
  let findUserByAttributesStub: sinon.SinonStub;
  let findSessionByUserIdStub: sinon.SinonStub;

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(
      authRepositories,
      "findUserByAttributes"
    );
    findSessionByUserIdStub = sinon.stub(
      authRepositories,
      "findSessionByAttributes"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send a verification email successfully", (done) => {
    const mockUser = { id: 1, email: "user@example.com", isVerified: false };
    const mockSession = { token: "testToken" };

    findUserByAttributesStub.resolves(mockUser);
    findSessionByUserIdStub.resolves(mockSession);

    router()
      .post("/api/auth/send-verify-email")
      .send({ email: "user@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.have.property(
          "message",
          "Verification email sent successfully."
        );
        done(err);
      });
  });
  it("should return 400 if session is not found", (done) => {
    const mockUser = { id: 1, email: "user@example.com", isVerified: false };
    const mockSession = { token: "testToken" };

    findUserByAttributesStub.resolves(mockUser);
    findSessionByUserIdStub.resolves(mockSession);
    findSessionByUserIdStub.resolves(null);
    router()
      .post("/api/auth/send-verify-email")
      .send({ email: "user@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "Invalid token.");
        done(err);
      });
  });

  it("should return internal server error", (done) => {
    findSessionByUserIdStub.resolves(null);
    const token = "invalid token";
    router()
      .get(`/api/auth/verify-email/${token}`)
      .send({ email: "user@example.com" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("message");
        done(err);
      });
  });
});

describe("sendVerificationEmail", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error when sendMail fails", async () => {
    sinon.stub(transporter, "sendMail").rejects(new Error("Network Error"));
    try {
      await sendVerificationEmail("email@example.com", "subject", "message");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});