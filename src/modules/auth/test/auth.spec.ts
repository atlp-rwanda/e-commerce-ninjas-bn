/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import authController from "../controller/authControllers";
import authRepositories from "../repository/authRepositories";
import Users from "../../../databases/models/users";
import Session from "../../../databases/models/session";
import { validation, isUserExist} from "../../../middlewares/validation";
import { resetPasswordSchema } from "../validation/authValidations";
import { sendResetPasswordEmail, sendVerificationEmail , transporter} from "../../../services/sendEmail";

chai.use(chaiHttp);
const router = () => chai.request(app);

let userId: number = 0;
let verifyToken: string | null = null;

describe("Authentication Test Cases", () => {

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
        expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
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
        expect(res.body).to.have.property("message", "Account verified successfully, now login.");
        done(err);
      })
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
        expect(res.body).to.have.property("message", "Account already exists. Please verify your account");
        done(err);
      });
  });


  it("should return internal server error", (done) => {
    sinon.stub(authRepositories, "findUserByAttributes").throws(new Error("Database error"));
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
    registerUserStub = sinon.stub(authRepositories, "createUser").throws(new Error("Failed to create account."));
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
          message: "Failed to create account."
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
      })
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
        expect(res.body).to.have.property("message", "Account already verified.");
        done(err);
      });
  });


});

describe("Authentication Test Cases", () => {
  let findUserByAttributesStub: sinon.SinonStub;
  let findSessionByUserIdStub: sinon.SinonStub;

  beforeEach(() => {
    findUserByAttributesStub = sinon.stub(authRepositories, "findUserByAttributes");
    findSessionByUserIdStub = sinon.stub(authRepositories, "findSessionByUserId");
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
        expect(res.body).to.have.property("message", "Verification email sent successfully.");
        done(err);
      });
  });
  it("should return 400 if session is not found", (done) => {
    const mockUser = { id: 1, email: "user@example.com", isVerified: false };
    const mockSession = { token: "testToken" };

    findUserByAttributesStub.resolves(mockUser);
    findSessionByUserIdStub.resolves(mockSession)
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

    expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Password reset email sent successfully." })).to.be.true;
    expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
    expect(generateTokenStub.calledOnceWith(user.id)).to.be.true;
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

  it("should return 500 if token generation fails", async () => {
    const email = "user@example.com";
    const user = { id: 1, email, isVerified: true };

    findUserByAttributesStub.resolves(user);
    generateTokenStub.throws(new Error("Token generation failed"));

    const req = {
        body: { email }
    };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
    };

    await authController.requestPasswordReset(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Token generation failed" })).to.be.true;
});

it("should return 500 if sending email fails", async () => {
  const email = "user@example.com";
  const user = { id: 1, email, isVerified: true };

  findUserByAttributesStub.resolves(user);
  generateTokenStub.returns("resetToken");
  sendResetPasswordEmailStub.rejects(new Error("Email sending failed"));

  const req = {
      body: { email }
  };
  const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
  };

  await authController.requestPasswordReset(req as any, res as any);

  expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
  expect(res.json.calledOnceWith({ message: "Email sending failed" })).to.be.true;
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


describe("POST /api/auth/reset-password/:token", () => {
  let updateUserPasswordByIdStub: SinonStub;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hashPasswordStub: SinonStub;

  beforeEach(() => {
      updateUserPasswordByIdStub = sinon.stub(authRepositories, "UpdateUserPasswordById");
      hashPasswordStub = sinon.stub().resolves("hashedPassword");
  });

  afterEach(() => {
      sinon.restore();
  });

  it("should reset password successfully with valid token and password", async () => {
      const req = {
          params: { token: "validToken" },
          body: { newPassword: "newPassword123" }
      };
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      };

      updateUserPasswordByIdStub.resolves();

      await authController.resetPassword(req as any, res as any);

      expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
      expect(res.json.calledOnceWith({ message: "Password reset successfully." })).to.be.true;
      expect(updateUserPasswordByIdStub.calledOnceWith(1, "hashedPassword")).to.be.true;
  });

  it("should return 500 if failed to reset password", async () => {
      const req = {
          params: { token: "validToken" },
          body: { newPassword: "newPassword123" }
      };
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      };

      updateUserPasswordByIdStub.rejects(new Error("Database error"));

      await authController.resetPassword(req as any, res as any);

      expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
      expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
      expect(updateUserPasswordByIdStub.calledOnce).to.be.true;
  });

  it("should return 400 if newPassword is missing or invalid", async () => {
      const req = {
          params: { token: "validToken" },
          body: {}
      };
      const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
      };

      await validation(resetPasswordSchema)(req as any, res as any, () => {});

      expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
      expect(res.json.calledOnceWith({ message: "newPassword is required" })).to.be.true;
      expect(updateUserPasswordByIdStub.called).to.be.false;
  });
});
