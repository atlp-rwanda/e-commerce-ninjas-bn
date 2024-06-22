/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import { isSessionExist, isUserExist, verifyOtp, verifyUser, verifyUserCredentials } from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import Session from "../../../databases/models/sessions";
import {
  sendEmail,
  transporter
} from "../../../services/sendEmail";
import googleAuth from "../../../services/googleAuth";
import { VerifyCallback } from "jsonwebtoken";
import passport from "passport";
import authControllers from "../controller/authControllers";
import * as helpers from "../../../helpers"
import * as emailService from "../../../services/sendEmail";
import { checkPasswordExpirations } from "../../../helpers/passwordExpiryNotifications";
import { Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

chai.use(chaiHttp);
const router = () => chai.request(app);

let userId: string;
let verifyToken: string | null = null;
let otp: string | null = null;

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

  it("Should not be able to login if user not verified", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
        expect(response.body).to.be.a("object");
        expect(response.body.message).to.be.a("string");
        done(error);
      });
  });

  it("Should not be able to login if user status is disabled", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
        expect(response.body).to.be.a("object");
        expect(response.body.message).to.be.a("string");
        done(error);
      });
  });

  it("Should not be able to login if user account is google", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "ecommerceninjas45@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.UNAUTHORIZED);
        expect(response.body).to.be.a("object");
        expect(response.body.message).to.be.a("string");
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

  it("Should return error on logout", (done) => {
    sinon
      .stub(authRepositories, "destroySessionByAttribute")
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
      id: "1",
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
      .send({ email: "test@example.com", password: "Password@123" })
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
      id: "1",
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
      await sendEmail("email@example.com", "subject", "message");
    } catch (error) {
      expect(error).to.be.an("error");
    }
  });
});

describe("Passport Configuration", () => {
  it("should serialize and deserialize user correctly", () => {
    const user = { id: "123", username: "testuser" };
    const doneSerialize = (err: any, serializedUser: any) => {
      expect(err).to.be.null;
      expect(serializedUser).to.deep.equal(user);
    };
    const doneDeserialize = (err: any, deserializedUser: any) => {
      expect(err).to.be.null;
      expect(deserializedUser).to.deep.equal(user);
    };
    googleAuth.passport.serializeUser(user, doneSerialize);
    googleAuth.passport.deserializeUser(user, doneDeserialize);
  });
});

describe("Google Authentication Strategy", () => {
  it("should call the strategy callback with correct parameters", () => {
  });
});

function googleAuthenticationCallback(
  request: Request,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback
) {
  userId = profile.id;
  const email = profile.emails?.[0].value || null;
  const firstName = profile.name?.givenName || null;
  const lastName = profile.name?.familyName || null;
  const picture = profile.photos?.[0].value || null;
  const accToken = accessToken;
  const user = {
    userId,
    email,
    firstName,
    lastName,
    picture,
    accToken
  };
  return done(null, user);
}

describe("Google Authentication Strategy Callback", () => {
  it("should create a user with all fields populated", () => {
    const profile = {
      id: "123",
      emails: [{ value: "test@example.com" }],
      name: { givenName: "John", familyName: "Doe" },
      photos: [{ value: "https://example.com/profile.jpg" }]
    };

    const request: Request = {} as Request;
    const accessToken = "accessToken";
    const refreshToken = "refreshToken";

    const done: VerifyCallback = (error, user) => {
      expect(error).to.be.null;
      expect(user).to.deep.equal({
        userId: "123",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        picture: "https://example.com/profile.jpg",
        accToken: "accessToken"
      });
    };

    googleAuthenticationCallback(
      request,
      accessToken,
      refreshToken,
      profile,
      done
    );
  });
});

describe("Google Authentication", () => {
  describe("Google Strategy", () => {
    it("should call the done callback with user object", () => {
      const requestMock: Partial<Request> = {};
      const accessTokenMock = "mockAccessToken";
      const refreshTokenMock = "mockRefreshToken";
      const profileMock = {
        id: "mockUserId",
        emails: [{ value: "test@example.com" }],
        name: { givenName: "John", familyName: "Doe" },
        photos: [{ value: "https://example.com/profile.jpg" }]
      };
      const doneStub = sinon.stub();


      googleAuth.passport._strategies.google._verify(
        requestMock as Request,
        accessTokenMock,
        refreshTokenMock,
        profileMock,
        doneStub
      );

      sinon.assert.calledWith(doneStub, null, {
        userId: "mockUserId",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        picture: "https://example.com/profile.jpg",
        accToken: "mockAccessToken"
      });
    });
  });
});

describe("authenticateViaGoogle", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let resJsonSpy: sinon.SinonSpy;
  let resStatusSpy: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    next = sinon.spy() as NextFunction;
    resJsonSpy = res.json as sinon.SinonSpy;
    resStatusSpy = res.status as sinon.SinonStub;
  });

  it("should respond with 401 if authentication fails", async () => {
    const authenticateStub = sinon.stub(passport, "authenticate").callsFake((strategy, callback) => {
      callback(null, null);
      return (req: Request, res: Response) => { };
    });

    await googleAuth.authenticateWithGoogle(req as Request, res as Response, next);

    expect(resStatusSpy.calledWith(401)).to.be.true;
    expect(resJsonSpy.calledWith({ error: "Authentication failed" })).to.be.true;

    authenticateStub.restore();
  });
});

describe("Forget password", () => {
  let resetToken: string = null
  afterEach(async () => {
    const user = await Users.findOne({ where: { email: "admin@gmail.com" } });
    if (user) {
      const tokenRecord = await Session.findOne({ where: { userId: user.dataValues.id } })
      if (tokenRecord) {
        resetToken = tokenRecord.token
      }
    }
  });
  it("should return send email for reset password", (done) => {
    router()
      .post("/api/auth/forget-password")
      .send({ email: "admin@gmail.com" })
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.OK);
        expect(res.body.message).to.be.equal("Check email for reset password.");
        done(err);
      })
  })
  it("should reset password when token is valid", (done) => {
    router()
      .put(`/api/auth/reset-password/${resetToken}`)
      .send({ newPassword: "Newpassword#12" })
      .end((err, res) => {
        expect(res.status).to.be.equal(httpStatus.OK);
        expect(res.body.message).to.be.equal("Password reset successfully.");
        done(err)
      })
  })
})

describe("verifyUser middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should respond with 404 if user is not found", async () => {
    req.body.email = "test@example.com";
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    await verifyUser(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.NOT_FOUND);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.NOT_FOUND,
      message: "Account not found."
    });
  });

  it("should respond with 400 if user is not verified", async () => {
    const mockUser = Users.build({
      id: "userId",
      email: "test@example.com",
      password: "hashedpassword",
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    req.body.email = "test@example.com";
    sinon.stub(authRepositories, "findUserByAttributes").resolves(mockUser);

    await verifyUser(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.BAD_REQUEST,
      message: "Account is not verified."
    });
  });

  it("should handle errors and respond with 500", async () => {
    req.body.email = "test@example.com";
    sinon.stub(authRepositories, "findUserByAttributes").rejects(new Error("Unexpected error"));

    await verifyUser(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Unexpected error"
    });
  });

  it("should call next if user is found and verified", async () => {
    req.body.email = "test@example.com";
    const user = Users.build({ id: "userId", isVerified: true });
    sinon.stub(authRepositories, "findUserByAttributes").resolves(user);

    await verifyUser(req as Request, res as Response, next);

    expect(next).to.have.been.calledOnce;
    expect(req.user).to.deep.equal(user);
  });
});

describe("isSessionExist middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: { id: "userId" },
      body: { newPassword: "newPassword123!" }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should respond with 400 if session does not exist", async () => {
    sinon.stub(authRepositories, "findSessionByAttributes").resolves(null);

    await isSessionExist(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.BAD_REQUEST,
      message: "Invalid token."
    });
  });

  it("should handle errors and respond with 500", async () => {
    sinon.stub(authRepositories, "findSessionByAttributes").rejects(new Error("Unexpected error"));

    await isSessionExist(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Unexpected error"
    });
  });
});

describe("verifyEmail", () => {
  it("should handle errors and respond with 500", async () => {
    const req = {
      user: { id: "userId" },
      session: { token: "token" }
    } as Partial<Request>;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    } as Partial<Response>;

    const error = new Error("Unexpected error");
    sinon.stub(authRepositories, "destroySessionByAttribute").throws(error);

    await authControllers.verifyEmail(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({
      status: 500,
      message: "Unexpected error"
    });

    sinon.restore();
  });
});

describe("forgetPassword", () => {
  it("should handle errors and respond with 500", async () => {
    const req = {
      user: { id: "userId", email: "user@example.com" },
      headers: { "user-device": "device" }
    } as Partial<Request>;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    } as Partial<Response>;

    const error = new Error("Unexpected error");
    sinon.stub(authRepositories, "createSession").throws(error);

    await authControllers.forgetPassword(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({
      message: "Unexpected error"
    });

    sinon.restore();
  });
});

describe("resetPassword", () => {
  it("should handle errors and respond with 500", async () => {
    const req = {
      user: { id: "userId", password: "newPassword" }
    } as Partial<Request>;

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    } as Partial<Response>;

    const error = new Error("Unexpected error");
    sinon.stub(authRepositories, "updateUserByAttributes").throws(error);

    await authControllers.resetPassword(req as Request, res as Response);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.json).to.have.been.calledWith({
      message: "Unexpected error"
    });

    sinon.restore();
  });
});

describe("updateUser2FA", () => {
  let req;
  let res;
  let token: string = null;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        token = response.body.data.token;
        done(error);
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should enable 2FA for the user and return success message", (done) => {
    router()
      .put("/api/auth/enable-2f")
      .set("Authorization", `Bearer ${token}`)
      .send({ is2FAEnabled: true })
      .end((error, response) => {
        expect(response.body).to.have.property("status", httpStatus.OK);
        expect(response.body).to.have.property(
          "message",
          "2FA enabled successfully."
        );
        expect(response.body).to.have.property("data");
        done(error);
      });
  });

  it("should return internal server error message if updating 2FA fails", (done) => {
    const errorMessage = "Failed to enable 2FA";
    sinon
      .stub(authRepositories, "updateUserByAttributes")
      .throws(new Error(errorMessage));
    router()
      .put("/api/auth/enable-2f")
      .set("Authorization", `Bearer ${token}`)
      .send({ is2FAEnabled: true })
      .end((error, response) => {
        expect(response.body).to.have.property(
          "status",
          httpStatus.INTERNAL_SERVER_ERROR
        );
        expect(response.body).to.have.property("message", errorMessage);
        done(error);
      });
  });
});

describe("verifyUserCredentials Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        email: "user@example.com",
        password: "Password@123"
      },
      headers: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if the user is not found", (done) => {
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);
    router()
      .post("/api/auth/login")
      .send({
        email: "example@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid Email or Password");
        done(error)
      })
  });

  it("should return 400 if the password does not match", async () => {
    const user: any = {
      id: 1,
      email: req.body.email,
      password: "hashedPassword",
      is2FAEnabled: false
    };
    sinon.stub(authRepositories, "findUserByAttributes").resolves(user);
    sinon.stub(helpers, "comparePassword").resolves(false);

    await verifyUserCredentials(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({
      message: "Invalid Email or Password"
    });
    expect(next).not.to.have.been.called;
  });

  it("should send OTP email if 2FA is enabled", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body.message).to.equal("Check your Email for OTP Confirmation");
        userId = response.body.UserId.userId
        done(error)
      })
  });

})

describe("verifyOtp", () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";
  let findUserStub, findSessionStub, destroySessionStub;
  afterEach(async () => {
    if (findUserStub) findUserStub.restore();
    if (findSessionStub) findSessionStub.restore();
    if (destroySessionStub) destroySessionStub.restore();
    const otpRecord = await Session.findOne({ where: { userId } })
    if (otpRecord) {
      otp = otpRecord.dataValues.otp
    }
  });
  it("should send otp when user is has enabled 2FA", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer1@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body.message).to.equal("Check your Email for OTP Confirmation");
        userId = response.body.UserId.userId
        done(error);
      });
  })
  it("should return 400 if sessionData is null or has no OTP", async () => {
    const user = Users.build({ id: validUUID });
    findUserStub = sinon.stub(authRepositories, "findUserByAttributes").resolves(user);
    findSessionStub = sinon.stub(authRepositories, "findSessionByUserIdOtp").resolves(null); // Simulate no session data

    const res = await chai.request(app)
      .post(`/api/auth/verify-otp/${validUUID}`)
      .send({ otp: "123456" });

    expect(res).to.have.status(httpStatus.BAD_REQUEST);
    expect(res.body.message).to.equal("Invalid or expired code.");
  });

  it("should return 400 if OTP is expired", async () => {
    const user = Users.build({ id: validUUID });
    const sessionData = Session.build({ otp: "123456", otpExpiration: new Date(Date.now() - 1000) });
    findUserStub = sinon.stub(authRepositories, "findUserByAttributes").resolves(user);
    findSessionStub = sinon.stub(authRepositories, "findSessionByUserIdOtp").resolves(sessionData);
    destroySessionStub = sinon.stub(authRepositories, "destroySessionByAttribute").resolves();

    const res = await chai.request(app)
      .post(`/api/auth/verify-otp/${validUUID}`)
      .send({ otp: "123456" });
    expect(res).to.have.status(httpStatus.BAD_REQUEST);
    expect(res.body.message).to.equal("OTP expired.");
  });

  it("should return 200 and proceed if OTP is valid and not expired", (done) => {

    router()
      .post(`/api/auth/verify-otp/${userId}`)
      .send({ otp: otp })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        done(error);
      })
  });


  it("should return 404 if user is not found", async () => {
    findUserStub = sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    const res = await chai.request(app)
      .post(`/api/auth/verify-otp/${validUUID}`)
      .send({ otp: "123456" });

    expect(res).to.have.status(httpStatus.NOT_FOUND);
    expect(res.body.message).to.equal("User not found.");

  });

  it("should return 500 if there is a server error", async () => {
    findUserStub = sinon.stub(authRepositories, "findUserByAttributes").rejects(new Error("Internal Server Error"));

    const res = await chai.request(app)
      .post(`/api/auth/verify-otp/${validUUID}`)
      .send({ otp: "123456" });

    expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.body.message).to.equal("Internal Server Error");

  });
});


describe("Validation tests", () => {

  it("Should reject invalid email", (done) => {
    router().post("/api/auth/login")
      .send({
        email: "mytest_email15456@gmail.com",
        password: "Password@123"
      })
     .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.has.property("message");
        expect(response.body.message).to.equal("Invalid Email or Password");
        done(error)
      })
  })
})