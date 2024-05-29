/* eslint-disable comma-dangle */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "./index";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import Users, { UsersAttributes } from "./databases/models/users";
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
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer validtoken",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call next if token is valid and user exists", async () => {
    const decodedToken = { id: 1 };
    const user: UsersAttributes = {
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "fabrice",
      lastName: "dushimimana",
      email: "fabrice@gmail.com",
      password: "$321!pass!123$",
      phone: 250782355975,
      profilePicture: "",
      gender: "male",
      birthDate: "3-9-2010",
      language: "english",
      currency: "USD",
      role: "buyer",
      id: 1,
    };

    sinon.stub(jwt, "verify").resolves(decodedToken);

    await protect(req, res, next);

    expect(req.user).to.equal(user);
    expect(next.calledOnce).to.be.true;
  });

  it("should respond with 401 if token is missing", async () => {
    req.headers.authorization = null;

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith(
        sinon.match({ message: "Login to get access to this resource" })
      )
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should respond with 401 if token is invalid", async () => {
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith(
        sinon.match({ message: "Invalid token. Log in again to get a new one" })
      )
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should respond with 401 if user does not exist", async () => {
    const decodedToken = { id: 1 };

    sinon.stub(jwt, "verify").resolves(decodedToken);
    sinon.stub(Users, "findByPk").resolves(null);

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(
      res.json.calledWith(
        sinon.match({ message: "User belonging to this token does not exist" })
      )
    ).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
