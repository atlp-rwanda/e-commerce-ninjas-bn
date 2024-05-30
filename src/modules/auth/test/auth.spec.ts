/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";
import httpStatus from "http-status";
import app from "../../..";
import authController from "../controller/authControllers";
import authRepositories from "../repository/authRepositories";
import { sendResetPasswordEmail, transporter} from "../../../services/sendEmail";


chai.use(chaiHttp);
const router = () => chai.request(app);

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
  let updateUserByAttributesStub: SinonStub;
  let destroySessionStub: SinonStub;
  let hashPasswordStub: SinonStub;

  beforeEach(() => {
    updateUserByAttributesStub = sinon.stub(authRepositories, "UpdateUserByAttributes");
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

    updateUserByAttributesStub.resolves();
    destroySessionStub.resolves();

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Password reset successfully." })).to.be.true;
    expect(updateUserByAttributesStub.calledOnceWith("password", "hashedPassword", "id", 1)).to.be.true;
    expect(destroySessionStub.calledOnceWith(1, "validToken")).to.be.true;
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

    updateUserByAttributesStub.rejects(new Error("Database error"));

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
    expect(updateUserByAttributesStub.calledOnce).to.be.true;
    expect(destroySessionStub.called).to.be.false;
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

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password is required" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
    expect(destroySessionStub.called).to.be.false;
  });

  it("should return 400 if newPassword does not meet requirements", async () => {
    const req = {
      params: { token: "validToken" },
      body: { newPassword: "weakpassword" } 
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password must contain letters, numbers, and special characters" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
    expect(destroySessionStub.called).to.be.false;
  });

  it("should return 500 if unable to hash the password", async () => {
    const req = {
      params: { token: "validToken" },
      body: { newPassword: "newPassword123" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    hashPasswordStub.rejects(new Error("Hashing error"));

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
    expect(destroySessionStub.called).to.be.false;
  });

  it("should return 500 if unable to destroy session", async () => {
    const req = {
      params: { token: "validToken" },
      body: { newPassword: "newPassword123" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    updateUserByAttributesStub.resolves();
    destroySessionStub.rejects(new Error("Session destruction error"));

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
    expect(updateUserByAttributesStub.calledOnce).to.be.true;
    expect(destroySessionStub.calledOnce).to.be.true;
  });
});







describe("POST /api/auth/reset-password/:token", () => {
  let updateUserByAttributesStub: SinonStub;
  let destroySessionStub: SinonStub;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hashPasswordStub: SinonStub;

  beforeEach(() => {
    updateUserByAttributesStub = sinon.stub(authRepositories, "UpdateUserByAttributes");
    // destroySessionStub = sinon.stub(authRepositories, "destroySession").resolves();
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

    updateUserByAttributesStub.resolves();
    destroySessionStub.resolves();

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Password reset successfully." })).to.be.true;
    expect(updateUserByAttributesStub.calledOnceWith("password", "hashedPassword", "id", 1)).to.be.true;
    expect(destroySessionStub.calledOnceWith(1, "validToken")).to.be.true;
  });

  it("should return 400 if newPassword is missing", async () => {
    const req = {
      params: { token: "validToken" },
      body: {}
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password is required" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
    expect(destroySessionStub.called).to.be.false;
  });

  it("should return 400 if newPassword does not meet requirements", async () => {
    const req = {
      params: { token: "validToken" },
      body: { newPassword: "weakpassword" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password should have a minimum length of 8, password must contain letters, numbers, and special characters" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
    expect(destroySessionStub.called).to.be.false;
  });
});




describe("POST /api/auth/reset-password/:token", () => {
  let updateUserByAttributesStub: SinonStub;

  beforeEach(() => {
    updateUserByAttributesStub = sinon.stub(authRepositories, "UpdateUserByAttributes");
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

    updateUserByAttributesStub.resolves();

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
    expect(res.json.calledOnceWith({ message: "Password reset successfully." })).to.be.true;
    expect(updateUserByAttributesStub.calledOnceWith("password", "hashedPassword", "id", 1)).to.be.true;
  });

  it("should return 400 if newPassword is missing", async () => {
    const req = {
      params: { token: "validToken" },
      body: {}
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password is required" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
  });

  it("should return 400 if newPassword does not meet requirements", async () => {
    const req = {
      params: { token: "validToken" },
      body: { newPassword: "weakpassword" }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await authController.resetPassword(req as any, res as any);

    expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
    expect(res.json.calledOnceWith({ message: "password should have a minimum length of 8, password must contain letters, numbers, and special characters" })).to.be.true;
    expect(updateUserByAttributesStub.called).to.be.false;
  });
});


// describe("POST /api/auth/request-password-reset", () => {
//   let findUserByAttributesStub: SinonStub;
//   let generateTokenStub: SinonStub;
//   let sendResetPasswordEmailStub: SinonStub;

//   beforeEach(() => {
//     findUserByAttributesStub = sinon.stub(authRepositories, "findUserByAttributes");
//     generateTokenStub = sinon.stub().returns("resetToken");
//     sendResetPasswordEmailStub = sinon.stub(transporter, "sendMail").resolves();
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   it("should send password reset email successfully", async () => {
//     const email = "user@example.com";
//     const user = { id: 1, email, isVerified: true };

//     findUserByAttributesStub.resolves(user);

//     const req = {
//       body: { email }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Password reset email sent successfully." })).to.be.true;
//     expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
//     expect(generateTokenStub.calledOnceWith(user.id)).to.be.true;
//     expect(sendResetPasswordEmailStub.calledOnce).to.be.true;
//   });

//   it("should return 404 if user is not found", async () => {
//     const email = "nonexistent@example.com";

//     findUserByAttributesStub.resolves(null);

//     const req = {
//       body: { email }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.NOT_FOUND)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Email not found." })).to.be.true;
//     expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
//     expect(generateTokenStub.called).to.be.false;
//     expect(sendResetPasswordEmailStub.called).to.be.false;
//   });

//   it("should return 400 if email field is missing", async () => {
//     const req = {
//       body: {}
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "email is required" })).to.be.true;
//     expect(findUserByAttributesStub.called).to.be.false;
//     expect(generateTokenStub.called).to.be.false;
//     expect(sendResetPasswordEmailStub.called).to.be.false;
//   });

//   it("should return 400 for invalid email format", async () => {
//     const req = {
//       body: { email: "invalid-email" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "email must be a valid email" })).to.be.true;
//     expect(findUserByAttributesStub.called).to.be.false;
//     expect(generateTokenStub.called).to.be.false;
//     expect(sendResetPasswordEmailStub.called).to.be.false;
//   });

//   it("should return 400 if email is not verified", async () => {
//     const email = "unverified@example.com";
//     const user = { id: 1, email, isVerified: false };

//     findUserByAttributesStub.resolves(user);

//     const req = {
//       body: { email }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Email is not verified." })).to.be.true;
//     expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
//     expect(generateTokenStub.called).to.be.false;
//     expect(sendResetPasswordEmailStub.called).to.be.false;
//   });

//   it("should return 500 if token generation fails", async () => {
//     const email = "user@example.com";
//     const user = { id: 1, email, isVerified: true };

//     findUserByAttributesStub.resolves(user);
//     generateTokenStub.throws(new Error("Token generation failed"));

//     const req = {
//       body: { email }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.requestPasswordReset(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Token generation failed" })).to.be.true;
//     expect(findUserByAttributesStub.calledOnceWith("email", email)).to.be.true;
//     expect(generateTokenStub.calledOnceWith(user.id)).to.be.true;
//     expect(sendResetPasswordEmailStub.called).to.be.false;
//   });
// });

// describe("POST /api/auth/reset-password/:token", () => {
//   let updateUserByAttributesStub: SinonStub;
//   let destroySessionStub: SinonStub;
//   let hashPasswordStub: SinonStub;

//   beforeEach(() => {
//     updateUserByAttributesStub = sinon.stub(authRepositories, "UpdateUserByAttributes");
//     hashPasswordStub = sinon.stub().resolves("hashedPassword");
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   it("should reset password successfully with valid token and password", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: { newPassword: "newPassword123" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     updateUserByAttributesStub.resolves();

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.OK)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Password reset successfully." })).to.be.true;
//     expect(updateUserByAttributesStub.calledOnceWith("password", "hashedPassword", "id", 1)).to.be.true;
//     expect(destroySessionStub.calledOnceWith(1, "validToken")).to.be.true;
//   });

//   it("should return 500 if failed to reset password", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: { newPassword: "newPassword123" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     updateUserByAttributesStub.rejects(new Error("Database error"));

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
//     expect(updateUserByAttributesStub.calledOnce).to.be.true;
//     expect(destroySessionStub.called).to.be.false;
//   });

//   it("should return 400 if newPassword is missing or invalid", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: {}
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "password is required" })).to.be.true;
//     expect(updateUserByAttributesStub.called).to.be.false;
//     expect(destroySessionStub.called).to.be.false;
//   });

//   it("should return 400 if newPassword does not meet requirements", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: { newPassword: "weakpassword" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.BAD_REQUEST)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "password must contain letters, numbers, and special characters" })).to.be.true;
//     expect(updateUserByAttributesStub.called).to.be.false;
//     expect(destroySessionStub.called).to.be.false;
//   });

//   it("should return 500 if unable to hash the password", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: { newPassword: "newPassword123" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     hashPasswordStub.rejects(new Error("Hashing error"));

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
//     expect(updateUserByAttributesStub.called).to.be.false;
//     expect(destroySessionStub.called).to.be.false;
//   });

//   it("should return 500 if unable to destroy session", async () => {
//     const req = {
//       params: { token: "validToken" },
//       body: { newPassword: "newPassword123" }
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub()
//     };

//     updateUserByAttributesStub.resolves();
//     destroySessionStub.rejects(new Error("Session destruction error"));

//     await authController.resetPassword(req as any, res as any);

//     expect(res.status.calledOnceWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
//     expect(res.json.calledOnceWith({ message: "Failed to reset password." })).to.be.true;
//     expect(updateUserByAttributesStub.calledOnce).to.be.true;
//     expect(destroySessionStub.calledOnce).to.be.true;
//   });
// });


