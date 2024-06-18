/* eslint-disable @typescript-eslint/no-explicit-any */
// src\index.spec.ts
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable comma-dangle */
import app from "./index";
import chai from "chai";
import chaiHttp from "chai-http";
const { expect } = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const { userAuthorization } = require("./middlewares/authorization");
const httpStatus = require("http-status");
import * as helpers from "./helpers/index";
import authRepositories from "./modules/auth/repository/authRepositories";
import { checkPasswordExpiration } from "./middlewares/passwordExpiryCheck";
import Users from "./databases/models/users";
import {  NextFunction } from "express";
import * as emailService from "../src/services/sendEmail";

chai.use(chaiHttp);
chai.use(sinonChai);
const router = () => chai.request(app);

describe("Initial configuration", () => {
  it("Should return `Welcome to the e-Commerce-Ninja BackEnd` when GET on /", (done) => {
    router()
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property(
          "message",
          "Welcome to the e-Commerce Ninjas BackEnd."
        );
        done(err);
      });
  });
});

describe("userAuthorization middleware", () => {
  let req, res, next, roles;

  beforeEach(() => {
    roles = ["admin", "user"];
    req = {
      headers: {},
      user: null,
      session: null,
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should respond with 401 if no authorization header", async () => {
    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("should respond with 401 if no session found", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves(null);

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("should respond with 401 if no user found", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({});
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("should respond with 401 if user role is not authorized", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({});
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .resolves({ role: "guest" });

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("should respond with 401 if user status is not enabled", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({});
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .resolves({ role: "admin", status: "disabled" });

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.UNAUTHORIZED,
      message: "Not authorized",
    });
  });

  it("should call next if user is authorized", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({});
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .resolves({ role: "admin", status: "enabled" });

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);

    expect(next).to.have.been.calledOnce;
    expect(req.user).to.deep.equal({ role: "admin", status: "enabled" });
    expect(req.session).to.deep.equal({});
  });

  it("should respond with 500 if an unexpected error occurs", async () => {
    req.headers.authorization = "Bearer validToken";
    sinon.stub(helpers, "decodeToken").rejects(new Error("Unexpected error"));

    const middleware = userAuthorization(roles);
    await middleware(req, res, next);
    
    expect(res.status).to.have.been.calledWith(
      httpStatus.INTERNAL_SERVER_ERROR
    );
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Unexpected error",
    });
  });
});



const PASSWORD_EXPIRATION_DAYS = Number(process.env.PASSWORD_EXPIRATION_DAYS);

describe("checkPasswordExpiration middleware", () => {
  let req: any, res: any, next: NextFunction;

  beforeEach(() => {
    req = {
      user: {
        id: 1,
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      setHeader: sinon.stub(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send an email and respond with 403 if the password is expired", async () => {
    sinon.stub(Users, "findByPk").resolves({
      passwordUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (PASSWORD_EXPIRATION_DAYS + 1)),
      email: "user@example.com",
    });
    const sendEmailStub = sinon.stub(emailService, "sendEmail").resolves();

    await checkPasswordExpiration(req, res, next);

 
    expect(sendEmailStub).to.have.been.calledOnceWith(
      "user@example.com",
      "Password Expired - Reset Required",
      `Your password has expired. Please reset your password using the following link: ${process.env.SERVER_URL_PRO}/api/auth/forget-password`
    );
    expect(res.status).to.have.been.calledWith(httpStatus.FORBIDDEN);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.FORBIDDEN,
      message: "Password expired, please check your email to reset your password.",
    });
    expect(next).to.not.have.been.called;
  });

  it("should set header if the password is expiring soon", async () => {
    const daysToExpire = 10;
    sinon.stub(Users, "findByPk").resolves({
      passwordUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (PASSWORD_EXPIRATION_DAYS - daysToExpire)),
      email: "user@example.com",
    });

    await checkPasswordExpiration(req, res, next);

    expect(res.setHeader).to.have.been.calledWith(
      "Password-Expiry-Notification",
      `Your password will expire in ${daysToExpire} days. Please update your password.`
    );
    expect(next).to.have.been.calledOnce;
  });

  it("should call next if the password is valid", async () => {
    sinon.stub(Users, "findByPk").resolves({
      passwordUpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      email: "user@example.com",
    });

    await checkPasswordExpiration(req, res, next);

  

    expect(next).to.have.been.calledOnce;
    expect(res.setHeader).to.not.have.been.called;
  });

  it("should respond with 500 if an error occurs", async () => {
    sinon.stub(Users, "findByPk").rejects(new Error("Database error"));

    await checkPasswordExpiration(req, res, next);

    expect(res.status).to.have.been.calledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).to.have.been.calledWith({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Database error",
    });
    expect(next).to.not.have.been.called;
  });
});
