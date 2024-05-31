/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../..";
import {
  isUserExist,
  verifyUserCredentials,
} from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import Session from "../../../databases/models/session";
import {
  sendVerificationEmail,
  transporter,
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
        password: "userPassword@123",
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
        password: "userPassword",
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
        password: "userPassword@123",
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
        email: "user@example.com",
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
        password: "userPassword@123",
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
        password: "fakePassword@123",
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
        password: "userPassword@123",
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
      updatedAt: new Date(),
    });

    sinon.stub(authRepositories, "findUserByAttributes").resolves(mockUser);

    router()
      .post("/api/auth/register")
      .send({
        email: "user@example.com",
        password: "userPassword@123",
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
        password: "userPassword@123",
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
          message: "Test error",
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
      updatedAt: new Date(),
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

describe("is OTP verified", () => {
  let findUserByAttributesStub;

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(
      authRepositories,
      "findUserByAttributes"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return User not found if user is not found", (done) => {
    findUserByAttributesStub.resolves(null);

    supertest(app)
      .post("/api/auth/verify-otp/1")
      .send({ otp: 234567 })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("message", "User not Found.");
        done(err);
      });
  });

  it("should return 500 if an error occurs", (done) => {
    const error = new Error("Internal Server Error");
    findUserByAttributesStub.rejects(error);

    supertest(app)
      .post("/api/auth/verify-otp/1")
      .send({ otp: 234567 })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.have.property("message", error.message);
        done(err);
      });
  });
});

describe("verifyUserCredentials Middleware", () => {
  let findUserByAttributesStub;

  before(() => {
    app.post(
      "/auth/login",
      verifyUserCredentials,
      (req: Request, res: Response) => {
        res.status(200).json({ message: "success" });
      }
    );
  });

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(
      authRepositories,
      "findUserByAttributes"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 'Invalid Email or Password' if user does not exist", (done) => {
    findUserByAttributesStub.resolves(null);

    supertest(app)
      .post("/auth/login")
      .send({ email: "nonexistent@example.com", password: "password123" })
      .end((err, res) => {
        expect(res.status).to.equal(httpStatus.BAD_REQUEST);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "message",
          "Invalid Email or Password"
        );
        expect(res.body).to.have.property("data", null);
        done(err);
      });
  });
});

describe("findSessionByUserIdAndToken", () => {
  let findOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Session, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return session when found", async () => {
    const sessionData = { id: 1, userId: 1, token: "some-token" };
    findOneStub.resolves(sessionData);

    const result = await authRepositories.findSessionByUserIdAndToken(
      1,
      "some-token"
    );

    expect(findOneStub.calledOnce).to.be.true;
    expect(
      findOneStub.calledWith({ where: { userId: 1, token: "some-token" } })
    ).to.be.true;
    expect(result).to.deep.equal(sessionData);
  });

  it("should return null when no session is found", async () => {
    findOneStub.resolves(null);

    const result = await authRepositories.findSessionByUserIdAndToken(
      1,
      "some-token"
    );

    expect(findOneStub.calledOnce).to.be.true;
    expect(
      findOneStub.calledWith({ where: { userId: 1, token: "some-token" } })
    ).to.be.true;
    expect(result).to.be.null;
  });

  it("should throw an error when findOne fails", async () => {
    const errorMessage = "Database error";
    findOneStub.rejects(new Error(errorMessage));

    try {
      await authRepositories.findSessionByUserIdAndToken(1, "some-token");
      throw new Error("Expected to throw an error");
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true;
      expect(
        findOneStub.calledWith({ where: { userId: 1, token: "some-token" } })
      ).to.be.true;
      expect(err).to.be.an("error");
      expect(err.message).to.equal(errorMessage);
    }
  });
});

describe("findSessionByAttributes", () => {
  let findOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Session, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return session when found", async () => {
    const sessionData = { id: 1, userId: 1, token: "some-token" };
    findOneStub.resolves(sessionData);

    const result = await authRepositories.findSessionByAttributes("userId", 1);

    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ where: { userId: 1 } })).to.be.true;
    expect(result).to.deep.equal(sessionData);
  });

  it("should return null when no session is found", async () => {
    findOneStub.resolves(null);

    const result = await authRepositories.findSessionByAttributes("userId", 1);

    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ where: { userId: 1 } })).to.be.true;
    expect(result).to.be.null;
  });

  it("should throw an error when findOne fails", async () => {
    const errorMessage = "Database error";
    findOneStub.rejects(new Error(errorMessage));

    try {
      await authRepositories.findSessionByAttributes("userId", 1);
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { userId: 1 } })).to.be.true;
      expect(err).to.be.an("error");
      expect(err.message).to.equal(errorMessage);
    }
  });
});

describe("findTokenByDeviceIdAndUserId", () => {
  let findOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Session, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return token when session is found", async () => {
    const sessionData = {
      id: 1,
      userId: 1,
      device: "some-device",
      token: "some-token",
    };
    findOneStub.resolves(sessionData);

    const result = await authRepositories.findTokenByDeviceIdAndUserId(
      "some-device",
      1
    );

    expect(findOneStub.calledOnce).to.be.true;
    expect(
      findOneStub.calledWith({ where: { device: "some-device", userId: 1 } })
    ).to.be.true;
    expect(result).to.equal("some-token");
  });

  it("should throw an error when findOne fails", async () => {
    const errorMessage = "Database error";
    findOneStub.rejects(new Error(errorMessage));

    try {
      await authRepositories.findTokenByDeviceIdAndUserId("some-device", 1);
      throw new Error("Expected to throw an error");
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true;
      expect(
        findOneStub.calledWith({ where: { device: "some-device", userId: 1 } })
      ).to.be.true;
      expect(err).to.be.an("error");
      expect(err.message).to.equal(errorMessage);
    }
  });
});

describe("deleteSessionData", () => {
  let destroyStub;

  beforeEach(() => {
    destroyStub = sinon.stub(Session, "destroy");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should delete session data by userId", async () => {
    destroyStub.resolves(1); 

    const result = await authRepositories.deleteSessionData(1);

    expect(destroyStub.calledOnce).to.be.true;
    expect(destroyStub.calledWith({ where: { userId: 1 } })).to.be.true;
    expect(result).to.equal(1);
  });

  it("should return 0 when no session data is found", async () => {
    destroyStub.resolves(0); 

    const result = await authRepositories.deleteSessionData(1);

    expect(destroyStub.calledOnce).to.be.true;
    expect(destroyStub.calledWith({ where: { userId: 1 } })).to.be.true;
    expect(result).to.equal(0);
  });

  it("should throw an error when destroy fails", async () => {
    const errorMessage = "Database error";
    destroyStub.rejects(new Error(errorMessage));

    try {
      await authRepositories.deleteSessionData(1);
      throw new Error("Expected to throw an error");
    } catch (err) {
      expect(destroyStub.calledOnce).to.be.true;
      expect(destroyStub.calledWith({ where: { userId: 1 } })).to.be.true;
      expect(err).to.be.an("error");
      expect(err.message).to.equal(errorMessage);
    }
  });
});

describe("findSessionByUserIdOtp", () => {
  let findOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Session, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return session when found", async () => {
    const sessionData = { id: 1, userId: 1, otp: 123456 };
    findOneStub.resolves(sessionData);

    const result = await authRepositories.findSessionByUserIdOtp(1, 123456);

    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ where: { userId: 1, otp: 123456 } })).to.be
      .true;
    expect(result).to.deep.equal(sessionData);
  });

  it("should return null when no session is found", async () => {
    findOneStub.resolves(null);

    const result = await authRepositories.findSessionByUserIdOtp(1, 123456);

    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ where: { userId: 1, otp: 123456 } })).to.be
      .true;
    expect(result).to.be.null;
  });

  it("should throw an error when findOne fails", async () => {
    const errorMessage = "Database error";
    findOneStub.rejects(new Error(errorMessage));

    try {
      await authRepositories.findSessionByUserIdOtp(1, 123456);
      throw new Error("Expected to throw an error");
    } catch (err) {
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { userId: 1, otp: 123456 } })).to
        .be.true;
      expect(err).to.be.an("error");
      expect(err.message).to.equal(errorMessage);
    }
  });
});


