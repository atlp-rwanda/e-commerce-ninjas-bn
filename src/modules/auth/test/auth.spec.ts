/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import authController from "../controller/authControllers";
import authRepositories from "../repository/authRepositories";
import * as authHelpers from "../../../helpers/index";
import { sendResetPasswordEmail, transporter} from "../../../services/sendEmail";


chai.use(chaiHttp);
const router = () => chai.request(app);

describe("POST /api/auth/reset-password/:token", () => {
  let verifyTokenStub: sinon.SinonStub;
  let hashPasswordStub: sinon.SinonStub;
  let updateUserByAttributesStub: sinon.SinonStub;

  beforeEach(() => {
      verifyTokenStub = sinon.stub(authHelpers, "verifyToken");
      hashPasswordStub = sinon.stub(authHelpers, "hashPassword");
      updateUserByAttributesStub = sinon.stub(authRepositories, "UpdateUserByAttributes");
  });

  afterEach(() => {
      verifyTokenStub.restore();
      hashPasswordStub.restore();
      updateUserByAttributesStub.restore();
  });

  it("should return 500 for invalid token format", async () => {
      const res = await chai.request(app)
          .post("/api/auth/reset-password/invalidToken")
          .send({ newPassword: "NewPassword1!" });

      expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).to.have.property("message");
  });

  it("should return 400 for invalid password format", async () => {
      const res = await chai.request(app)
          .post("/api/auth/reset-password/validToken")
          .send({ newPassword: "short" });

      expect(res).to.have.status(httpStatus.BAD_REQUEST);
      expect(res.body).to.have.property("message");
  });

  it("should return 500 for expired or invalid token", async () => {
      verifyTokenStub.throws(new Error("Expired token"));

      const res = await chai.request(app)
          .post("/api/auth/reset-password/expiredToken")
          .send({ newPassword: "NewPassword1!" });

      expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).to.have.property("message", "Expired token");
  });

  it("should return 500 for internal server error", async () => {
      verifyTokenStub.returns({ id: 1 });
      hashPasswordStub.resolves("hashedPassword");
      updateUserByAttributesStub.rejects(new Error("Internal server error"));

      const res = await chai.request(app)
          .post("/api/auth/reset-password/validToken")
          .send({ newPassword: "NewPassword1!" });

      expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body).to.have.property("message", "Internal server error");
  });
});


describe("POST /api/auth/request-password-reset", () => {
  let findUserByAttributesStub: SinonStub;
  let generateTokenStub: SinonStub;
  let sendResetPasswordEmailStub: SinonStub;

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(authRepositories, "findUserByAttributes");
    generateTokenStub = sinon.stub().returns("resetToken");
    sendResetPasswordEmailStub = sinon.stub().resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should send password reset email successfully", async () => {
    const email = "user@example.com";
    const user = { id: 1, email, isVerified: true };

    findUserByAttributesStub.resolves(user);
    generateTokenStub.returns("resetToken");
    sendResetPasswordEmailStub.resolves();

    const req = {
        body: { email }
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    await authController.requestPasswordReset(req as any, res as any);
    expect(res.json.calledOnceWith({ message: "Password reset email sent successfully." })).to.be.true;
    expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
    expect(sendResetPasswordEmailStub.calledOnceWith(email, "Password Reset Request", sinon.match.string)).to.be.true;
});

  it("should return 404 if user is not found", (done) => {
    const email = "nonexistent@example.com";

    findUserByAttributesStub.resolves(null);

    router()
      .post("/api/auth/request-password-reset")
      .send({ email })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("message", "Email not found.");
        expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
        done(err);
      });
  });

  it("should return 400 if email field is missing", (done) => {
    router()
      .post("/api/auth/request-password-reset")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "email is required");
        done(err);
      });
  });

  it("should return 400 for invalid email format", (done) => {
    router()
      .post("/api/auth/request-password-reset")
      .send({ email: "invalid-email" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "email must be a valid email");
        done(err);
      });
  });

  it("should return 400 if email is not verified", (done) => {
    const email = "unverified@example.com";
    const user = { id: 1, email, isVerified: false };

    findUserByAttributesStub.resolves(user);

    router()
      .post("/api/auth/request-password-reset")
      .send({ email })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
        expect(res.body).to.have.property("message", "Email is not verified.");
        expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
        done(err);
      });
  });

});

describe("sendResetPasswordEmail", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw an error when sendMail fails", async () => {
    sinon.stub(transporter, "sendMail").rejects(new Error("Network Error"));
    try {
      await sendResetPasswordEmail("email@example.com", "subject", "message");
    } catch (error) {
      expect(error).to.be.an("error");
      expect(error.message).to.equal("Network Error");
    }
  });
});



describe("Auth Helpers", () => {
  describe("generateToken", () => {
      it("should generate a valid token", () => {
          const token = authHelpers.generateToken(1);
          expect(token).to.be.a("string");
      });
  });

  describe("verifyToken", () => {
      it("should verify a valid token", () => {
          const token = authHelpers.generateToken(1);
          const decoded = authHelpers.verifyToken(token);
          expect(decoded).to.have.property("id", 1);
      });

      it("should throw an error for an invalid token", () => {
          expect(() => authHelpers.verifyToken("invalidToken")).to.throw();
      });
  });

  describe("hashPassword", () => {
      it("should hash a password", async () => {
          const password = "password123";
          const hashedPassword = await authHelpers.hashPassword(password);
          expect(hashedPassword).to.be.a("string");
          expect(hashedPassword).to.not.equal(password);
      });
  });
});