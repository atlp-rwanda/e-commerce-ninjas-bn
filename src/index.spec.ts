/* eslint-disable comma-dangle */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "./index";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import authRepositories from "./modules/auth/repository/authRepositories";
import { protect } from "./middlewares";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Initial configuration", () => {
  it("Should return `Welcome to the e-Commerce-Ninja BackEnd` when GET on /", (done) => {
    router()
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property(
          "message",
          "Welcome to the e-Commerce Ninjas BackEnd."
        );
        done(err);
      });
  });
});

describe("protect middleware", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      headers: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should call next() if token is valid and user exists", async () => {
    const user = { id: "123", name: "John Doe" };
    const token = jwt.sign({ id: user.id }, "SECRET");

    sandbox.stub(jwt, "verify").resolves({ id: user.id });
    sandbox.stub(authRepositories, "findUserByAttributes").resolves(user);

    req.headers.authorization = `Bearer ${token}`;

    await protect(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal(user);
  });

  it("should return 401 if no token is provided", async () => {
    req.headers.authorization = "";

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        ok: false,
        status: "fail",
        message: "Login to get access to this resource",
      })
    ).to.be.true;
  });

  it("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidtoken";

    sandbox
      .stub(jwt, "verify")
      .throws(new jwt.JsonWebTokenError("invalid token"));

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        ok: false,
        status: "fail",
        message: "Invalid token. Log in again to get a new one",
      })
    ).to.be.true;
  });

  it("should return 401 if user does not exist", async () => {
    const token = jwt.sign({ id: "123" }, "SECRET");

    sandbox.stub(jwt, "verify").resolves({ id: "123" });
    sandbox.stub(authRepositories, "findUserByAttributes").resolves(null);

    req.headers.authorization = `Bearer ${token}`;

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        ok: false,
        status: "fail",
        message: "User belonging to this token does not exist",
      })
    ).to.be.true;
  });

  it("should handle jwt token expiration errors", async () => {
    req.headers.authorization = "Bearer expiredtoken";

    const error = new jwt.TokenExpiredError("jwt expired", new Date());
    sandbox.stub(jwt, "verify").throws(error);

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith({
        ok: false,
        status: "fail",
        message: "Invalid token. Log in again to get a new one",
      })
    ).to.be.true;
  });
});
