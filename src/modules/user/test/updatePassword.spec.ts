// src\password.spec.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import sinon  from "sinon";
import { Op } from "sequelize";
import { addDays } from "date-fns";
import Users from "../../../databases/models/users";
import { sendEmail } from "../../../services/sendEmail";
import { checkPasswordExpirations } from "../../../helpers/updatePassword.cronjob";
import app from "../../../../src/index";
import chai  from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const router = () => chai.request(app);

const PASSWORD_EXPIRATION_DAYS = 90

describe("checkPasswordExpirations", () => {
  let findAllStub: sinon.SinonStub;
  let sendEmailStub: sinon.SinonStub;

  beforeEach(() => {
    findAllStub = sinon.stub(Users, "findAll");
    // sendEmailStub = sinon.stub(sendEmail, "call").callsFake(() => Promise.resolve());
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should notify users with expired passwords", async () => {
    const mockUsers = [
      { email: "user1@example.com", updatedAt: new Date(Date.now() - (PASSWORD_EXPIRATION_DAYS + 1) * 24 * 60 * 60 * 1000) },
      { email: "user2@example.com", updatedAt: new Date(Date.now() - (PASSWORD_EXPIRATION_DAYS + 2) * 24 * 60 * 60 * 1000) }
    ];

    findAllStub.resolves(mockUsers);
    sendEmailStub.resolves();

    await checkPasswordExpirations();

    expect(findAllStub).to.have.been.calledOnceWith({
      where: {
        updatedAt: {
          [Op.lte]: addDays(new Date(), - PASSWORD_EXPIRATION_DAYS)
        }
      }
    });

    expect(sendEmailStub.callCount).to.equal(mockUsers.length);
    expect(sendEmailStub.firstCall.args).to.deep.equal([
      "user1@example.com",
      "Password Expiration Notice",
      "Dear user1@example.com, your password has expired. Please update your password to continue using the E-commerce Ninja."
    ]);
    expect(sendEmailStub.secondCall.args).to.deep.equal([
      "user2@example.com",
      "Password Expiration Notice",
      "Dear user2@example.com, your password has expired. Please update your password to continue using the E-commerce Ninja."
    ]);
  });

  it("should handle errors when sending email", async () => {
    const mockUsers = [
      { email: "user1@example.com", updatedAt: new Date(Date.now() - (PASSWORD_EXPIRATION_DAYS + 1) * 24 * 60 * 60 * 1000) }
    ];

    findAllStub.resolves(mockUsers);
    sendEmailStub.rejects(new Error("Failed to send email"));

    await checkPasswordExpirations();

    expect(sendEmailStub).to.have.been.calledOnce;
  });

  it("should handle no users with expired passwords", async () => {
    findAllStub.resolves([]);

    await checkPasswordExpirations();

    expect(findAllStub).to.have.been.calledOnce;
    expect(sendEmailStub).not.to.have.been.called;
  });

  it("should handle errors during user retrieval", async () => {
    findAllStub.rejects(new Error("Database error"));

    await checkPasswordExpirations();

    expect(findAllStub).to.have.been.calledOnce;
    expect(sendEmailStub).not.to.have.been.called;
  });
});

