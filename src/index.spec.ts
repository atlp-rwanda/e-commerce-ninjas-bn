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
import { Socket } from "socket.io";
import { socketAuthMiddleware } from "./middlewares/authorization";

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


describe("socketAuthMiddleware", () => {
  let socket: Socket;
  let next: sinon.SinonSpy;

  beforeEach(() => {
    socket = {
      handshake: { auth: { token: "" } },
      data: {},
    } as unknown as Partial<Socket> as Socket;
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call next with an error if no token is provided", async () => {
    socket.handshake.auth.token = "";

    await socketAuthMiddleware(socket, next);

    expect(next).to.have.been.calledOnce;
    const error = next.getCall(0).args[0];
    expect(error.message).to.equal("Authentication error");
    expect(error.data.message).to.equal("No token provided");
  });

  it("should call next with an error if token is invalid", async () => {
    sinon.stub(helpers, "decodeToken").resolves(null);

    socket.handshake.auth.token = "invalidToken";

    await socketAuthMiddleware(socket, next);

    expect(next).to.have.been.calledOnce;
    const error = next.getCall(0).args[0];
    expect(error.message).to.equal("Authentication error");
    expect(error.data.message).to.equal("Invalid token");
  });

  it("should call next with an error if session is not found", async () => {
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves(null);

    socket.handshake.auth.token = "validToken";

    await socketAuthMiddleware(socket, next);

    expect(next).to.have.been.calledOnce;
    const error = next.getCall(0).args[0];
    expect(error.message).to.equal("Authentication error");
    expect(error.data.message).to.equal("Session not found or expired");
  });

  it("should call next with an error if user is not found", async () => {
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({ id: "sessionId" });
    sinon.stub(authRepositories, "findUserByAttributes").resolves(null);

    socket.handshake.auth.token = "validToken";

    await socketAuthMiddleware(socket, next);

    expect(next).to.have.been.calledOnce;
    const error = next.getCall(0).args[0];
    expect(error.message).to.equal("Authentication error");
    expect(error.data.message).to.equal("User not found");
  });

  it("should attach user data to socket and call next if authentication is successful", async () => {
    const user = { id: "userId", firstName: "John", lastName: "Doe", email: "john.doe@example.com", profilePicture: "url" ,role: "admin" };
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({ id: "sessionId" });
    sinon.stub(authRepositories, "findUserByAttributes").resolves(user);

    socket.handshake.auth.token = "validToken";

    await socketAuthMiddleware(socket, next);

    expect(socket.data.user).to.deep.equal({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      role:user.role
    });
    expect(next).to.have.been.calledOnce;
  });

  it("should call next with an error if an unexpected error occurs", async () => {
    sinon.stub(helpers, "decodeToken").throws(new Error("Unexpected error"));

    socket.handshake.auth.token = "validToken";

    await socketAuthMiddleware(socket, next);

    expect(next).to.have.been.calledOnce;
    const error = next.getCall(0).args[0];
    expect(error.message).to.equal("Internal server error");
    expect(error.data.message).to.equal("Internal server error");
  });

  it("should initialize socket.data if it is undefined", async () => {
    socket.data = undefined;

    const user = { id: "userId", firstName: "John", lastName: "Doe", email: "john.doe@example.com", profilePicture: "url" ,role: "admin"};
    sinon.stub(helpers, "decodeToken").resolves({ id: "userId" });
    sinon.stub(authRepositories, "findSessionByUserIdAndToken").resolves({ id: "sessionId" });
    sinon.stub(authRepositories, "findUserByAttributes").resolves(user);

    socket.handshake.auth.token = "validToken";

    await socketAuthMiddleware(socket, next);

    expect(socket.data).to.not.be.undefined;
    expect(socket.data.user).to.deep.equal({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      role:user.role
    });
    expect(next).to.have.been.calledOnce;
  });
});
