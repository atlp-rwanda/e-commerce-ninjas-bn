/* eslint-disable comma-dangle */
/* eslint quotes: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";
import httpStatus from "http-status";
import app from "../../../index";
import Users from "../../../databases/models/users";
import authRepositories from "../../auth/repository/authRepositories";
import { isUsersExist } from "../../../middlewares/validation";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import uploadImages from "../../../helpers/uploadImage";
import { v2 as cloudinary } from "cloudinary";
import userRepositories from "../repository/userRepositories";
const imagePath = path.join(__dirname, "../test/testImage.jpg");
const imageBuffer = fs.readFileSync(imagePath);

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Update User Status test case ", () => {
  let getUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;
  const testUserId = 1;
  let userId: number = null;
  const unknownId = 100;
  let token;

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "nda1234@gmail.com",
        password: "userPassword@123",
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

  it("Should be able to login admin", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "$321!Pass!123$",
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

  it("should update the user status successfully", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${userId}`)
      .send({ status: "disabled" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "message",
          "Status updated successfully."
        );
        done(err);
      });
  });

  it("should handle invalid user status", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${userId}`)
      .send({ status: "disableddd" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "message",
          "Status must be either 'enabled' or 'disabled'"
        );
        done(err);
      });
  });

  it("should return 404 if user doesn't exist", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${unknownId}`)
      .send({ status: "disabled" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("message", "User not found");
        done(err);
      });
  });
  it("Should return 500 internal server error", (done) => {
    sinon
      .stub(authRepositories, "updateUserByAttributes")
      .throws(new Error("Internal server error"));

    router()
      .put(`/api/user/admin-update-user-status/${userId}`)
      .send({ status: "disabled" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "Internal server error");
        done(err);
      });
  });
});

describe("User Repository Functions", () => {
  let findOneStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Users, "findOne");
    updateStub = sinon.stub(Users, "update");
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe("getSingleUserById", () => {
    it("should return a user if found", async () => {
      const user = { id: 1, status: true };
      findOneStub.resolves(user);
      const result = await authRepositories.findUserByAttributes("id", 1);
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { id: 1 } })).to.be.true;
      expect(result).to.equal(user);
    });

    it("should throw an error if there is a database error", async () => {
      findOneStub.rejects(new Error("Database error"));
      try {
        await authRepositories.findUserByAttributes("id", 1);
      } catch (error) {
        expect(findOneStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user status successfully", async () => {
      updateStub.resolves([1]);
      const user = { id: 1, status: true };
      const result = await authRepositories.updateUserByAttributes(
        "status",
        "enabled",
        "id",
        1
      );
      expect(updateStub.calledOnce).to.be.true;
      expect(updateStub.calledWith({ status: true }, { where: { id: 1 } })).to
        .be.false;
    });

    it("should throw an error if there is a database error", async () => {
      updateStub.rejects(new Error("Database error"));
      try {
        await authRepositories.updateUserByAttributes(
          "status",
          "enabled",
          "id",
          1
        );
      } catch (error) {
        expect(updateStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });
});

describe("Admin update User roles", () => {
  before(async () => {
    await Users.destroy({
      where: {},
    });
  });
  after(async () => {
    await Users.destroy({
      where: {},
    });
  });
  let userIdd: number = null;

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "nda12345@gmail.com",
        password: "userPassword@123",
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userIdd = response.body.data.user.id;
        expect(response.body).to.have.property(
          "message",
          "Account created successfully. Please check email to verify account."
        );
        done(error);
      });
  });

  it("Should be able to login a registered user", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "$321!Pass!123$",
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        expect(response.body.data).to.have.property("token");

        done(error);
      });
  });

  it("Should notify if no role is specified", async () => {
    const response = await router().put(
      `/api/user/admin-update-role/${userIdd}`
    );

    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property("message");
  });

  it("Should notify if the role is other than ['admin', 'buyer', 'seller']", async () => {
    const response = await router()
      .put(`/api/user/admin-update-role/${userIdd}`)
      .send({ role: "Hello" });

    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property(
      "message",
      "Only admin, buyer and seller are allowed."
    );
  });

  it("Should return error when invalid Id is passed", async () => {
    const response = await router()
      .put("/api/user/admin-update-role/invalid-id")
      .send({ role: "admin" });

    expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response).to.have.property(
      "status",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  });

  it("Should update User and return updated user", (done) => {
    router()
      .put(`/api/user/admin-update-role/${userIdd}`)
      .send({ role: "admin" })

      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property(
          "message",
          "User role updated successfully"
        );
        done(err);
      });
  });

  it("Should return 404 if user is not found", (done) => {
    router()
      .put("/api/users/admin-update-role/10001")
      .send({ role: "Admin" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User not found");
        done(err);
      });
  });
});
