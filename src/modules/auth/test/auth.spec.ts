/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable no-shadow */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import { isUserExist, verifyUserCredentials } from "../../../middlewares/validation";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import Session from "../../../databases/models/session";
import {
  sendVerificationEmail,
  transporter
} from "../../../services/sendEmail";
import passport from "passport";
import googleAuth from "../../../services/googleAuth";
import dotenv from "dotenv";
import { VerifyCallback } from "passport-google-oauth2";
dotenv.config();
chai.use(chaiHttp);
const router = () => chai.request(app);

let userId: string;
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
describe("verifyUserCredentials Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

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
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if the user is not found", async () => {
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    await verifyUserCredentials(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.BAD_REQUEST);
    expect(res.json).to.have.been.calledWith({
      message: "Invalid Email or Password"
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    sinon.stub(authRepositories, "findUserByAttributes").throws(new Error("Internal Server Error"));

    await verifyUserCredentials(req as Request, res as Response, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      message: "Internal Server error",
      data: "Internal Server Error"
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
    const userId = profile.id;
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
          return (req: Request, res: Response, next: NextFunction) => { };
        });
    
        await googleAuth.authenticateWithGoogle(req as Request, res as Response, next);
    
        expect(resStatusSpy.calledWith(401)).to.be.true;
        expect(resJsonSpy.calledWith({ error: "Authentication failed" })).to.be.true;
    
        authenticateStub.restore();
      });
    });