/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint quotes: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../../index";
import Users from "../../../databases/models/users";
import authRepositories from "../../auth/repository/authRepositories";
import { isUsersExist } from "../../../middlewares/validation";
import path from "path";
import fs from "fs";
import userRepositories from "../repository/userRepositories";
import db from "../../../databases/models";
import { hashPassword } from "../../../helpers";

const imagePath = path.join(__dirname, "../test/testImage.jpg");
const imageBuffer = fs.readFileSync(imagePath);
import { sendEmail, sendEmailOrderStatus } from "../../../services/sendEmail";
import { transporter } from "../../../services/sendEmail";

chai.use(chaiHttp);
const router = () => chai.request(app);
let userIdd: string;
describe("Update User Status test case ", () => {
  let userId = null;
  const unknownId = "10000000-0000-0000-0000-000000000000";
  let token: string = null;

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
        email: "newadmin@gmail.com",
        password: "AdminPassword@123",
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

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "ecommerceninjas46@gmail.com",
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
        expect(res).to.have.status(httpStatus.BAD_REQUEST);
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
        expect(res.body).to.have.property("message");
        done(err);
      });
  });
});

describe("User Repository Functions", () => {
  let findOneStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(db.Addresses, "findOne");
    updateStub = sinon.stub(db.Addresses, "update");
    createStub = sinon.stub(db.Addresses, "create");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("updateUserAddress", () => {
    it("should update and return the user address", async () => {
      const userId = "123";
      const address = { province: "Test Province", district: "Test District" };
      const updatedAddress = { id: "1", userId, ...address };

      updateStub.resolves([1]);
      findOneStub.resolves(updatedAddress);

      const result = await userRepositories.updateUserAddress(address, userId);

      expect(updateStub.calledOnce).to.be.true;
      expect(updateStub.calledWith(address, { where: { userId }, returning: true })).to.be.true;
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { userId } })).to.be.true;
      expect(result).to.deep.equal(updatedAddress);
    });
  });

  describe("addUserAddress", () => {
    it("should create and return a new user address", async () => {
      const address = { userId: "123", province: "Test Province", district: "Test District" };
      const createdAddress = { id: "1", ...address };

      createStub.resolves(createdAddress);

      const result = await userRepositories.addUserAddress(address);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWith(address)).to.be.true;
      expect(result).to.deep.equal(createdAddress);
    });
  });

  describe("findAddressByUserId", () => {
    it("should return the address for a given user ID", async () => {
      const userId = "123";
      const address = { id: "1", userId, province: "Test Province", district: "Test District" };

      findOneStub.resolves(address);

      const result = await userRepositories.findAddressByUserId(userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { userId } })).to.be.true;
      expect(result).to.deep.equal(address);
    });

    it("should return null if no address is found", async () => {
      const userId = "123";

      findOneStub.resolves(null);

      const result = await userRepositories.findAddressByUserId(userId);

      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { userId } })).to.be.true;
      expect(result).to.be.null;
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user status successfully", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000";
      const newStatus = "enabled";
      
      updateStub.resolves([1]);
      
      const result = await authRepositories.updateUserByAttributes(
        "status",
        newStatus,
        "id",
        userId
      );
  
      expect(updateStub.calledOnce).to.be.false;
    });
  });
});

describe("Admin update User roles", () => {

  let token = null;
  const unknownId = "10000000-0000-0000-0000-000000000000";

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "ecommerceninjas47@gmail.com",
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

  it("Should login admin", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "newadmin@gmail.com",
        password: "AdminPassword@123",
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

  it("Should notify if no role is specified", (done) => {

    router()
      .put(`/api/user/admin-update-user-role/${userIdd}`)
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message", "The 'role' parameter is required.");
        done(error);
      });
  });

  it("Should notify if the role is other than ['admin', 'buyer', 'seller']", async () => {
    const response = await router()
      .put(`/api/user/admin-update-user-role/${userIdd}`)
      .send({ role: "Hello" })
      .set("authorization", `Bearer ${token}`);
    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property(
      "message",
      "Only admin, buyer and seller are allowed."
    );
  });

  it("Should return error when invalid Id is passed", async () => {
    const response = await router()
      .put("/api/user/admin-update-user-role/invalid-id")
      .send({ role: "admin" })
      .set("authorization", `Bearer ${token}`);

    expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response).to.have.property(
      "status",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  });

  it("Should update User and return updated user", (done) => {
    router()
      .put(`/api/user/admin-update-user-role/${userIdd}`)
      .send({ role: "seller" })
      .set("authorization", `Bearer ${token}`)
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
      .put(`/api/user/admin-update-user-role/${unknownId}`)
      .send({ role: "admin" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User not found");
        done(err);
      });
  });

  it("Should return 500 internal server error", (done) => {
    sinon
      .stub(authRepositories, "updateUserByAttributes")
      .throws(new Error("Internal server error"));

    router()
      .put(`/api/user/admin-update-user-role/${userIdd}`)
      .send({ role: "admin" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        done(err);
      });
  });
});

describe("Middleware: isUsersExist", () => {
  it("should call next if users exist", async () => {
    const userCountStub = sinon.stub(Users, "count").resolves(1);
    const req: any = {};
    const res: any = {};
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(next.calledOnce).to.be.true;
    userCountStub.restore();
  });

  it("should return 404 if no users exist", async () => {
    const userCountStub = sinon.stub(Users, "count").resolves(0);
    const req: any = {};
    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ status: httpStatus.NOT_FOUND, message: "No users found in the database." })).to
      .be.true;
    expect(next.called).to.be.false;
    userCountStub.restore();
  });

  it("should return 500 if there is an error", async () => {
    const userCountStub = sinon
      .stub(Users, "count")
      .throws(new Error("DB error"));
    const req: any = {};
    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(res.status.calledWith(httpStatus.INTERNAL_SERVER_ERROR)).to.be.true;
    userCountStub.restore();
  });
});

describe("Admin Controllers", () => {
  let token: string = null;
  let userId: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "newadmin@gmail.com",
        password: "AdminPassword@123",
      })
      .end((error, response) => {
        token = response.body.data.token;
        done(error);
      });
  });

  it("should return all users", (done) => {
    router()
      .get("/api/user/admin-get-users")
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        userId = response.body.data.user[0].id;
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        done(error);
      });
  });

  it("should return one user", (done) => {
    router()
      .get(`/api/user/admin-get-user/${userId}`)
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.an("object");
        done(error);
      });
  });

  it("Should be able to get profile", (done) => {
    router()
      .get(`/api/user/user-get-profile/`)
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        done(error);
      });
  });

  it("should update profile ", (done) => {
    router()
      .put(`/api/user/user-update-profile`)
      .set("Authorization", `Bearer ${token}`)
      .field("firstName", "MANISHIMWE")
      .field("lastName", "Salton Joseph")
      .field("phone", "787312593")
      .field("gender", "male")
      .field("birthDate", "1943-02-04")
      .field("language", "english")
      .field("currency", "USD")
      .attach("profilePicture", imageBuffer, "testImage.jpg")
      .end((error, response) => {
        expect(response.status).to.equal(200);
        done(error);
      });
  });

  it("should return Internal server error", (done) => {
    sinon
      .stub(authRepositories, "findUserByAttributes")
      .throws(new Error("Internal server error"));
    router()
      .get(`/api/user/admin-get-user/${userId}`)
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property(
          "message",
          "Internal server error"
        );
        done(error);
      });
  });

  it("should return internal server error", (done) => {
    sinon
      .stub(userRepositories, "getAllUsers")
      .throws(new Error("Internal server error"));
    router()
      .get("/api/user/admin-get-users")
      .set("authorization", `Bearer ${token}`)
      .end((error, response) => {
        expect(response).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property(
          "message",
          "Internal server error"
        );
        done(error);
      });
  });
});

describe('postChatMessage', () => {
  let testUser;
  before(async () => {
    testUser = await db.Users.create({
      id: 'cfefa1c6-af47-42f0-94d3-7c2915580ccb',
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      password: hashPassword("Password@123"),
      role: 'buyer',
      status: 'enabled'
    });
  });

  after(async () => {
    await db.Chats.destroy({ where: { userId: testUser.id } });
    await db.Users.destroy({ where: { id: testUser.id } });
  });

  it('should create a chat message and associate it with the user', async () => {
    const message = 'Test message';
    const chat = await userRepositories.postChatMessage(testUser.id, message);
    expect(chat).to.be.an('object');
    expect(chat).to.have.property('message', message);
    expect(chat).to.have.property('userId', testUser.id);

    expect(chat.user).to.be.an('object');
    expect(chat.user).to.have.property('id', testUser.id);
    expect(chat.user).to.have.property('firstName', testUser.firstName);
    expect(chat.user).to.have.property('lastName', testUser.lastName);
    expect(chat.user).to.have.property('email', testUser.email);
  });
  it('should retrieve up to 50 past chats ordered by createdAt ascending', async () => {
    const pastChats = await userRepositories.getAllPastChats();

    expect(pastChats).to.be.an('array').with.length.at.most(50);
    const hasUsers = pastChats.every(chat => {
      return chat.dataValues.user && chat.dataValues.user.id;
    });
    expect(hasUsers).to.be.true;
    const hasValidUserAttributes = pastChats.every(chat =>
      chat.dataValues.user &&
      chat.dataValues.user.id &&
      chat.dataValues.user.firstName &&
      chat.dataValues.user.lastName &&
      chat.dataValues.user.email &&
      chat.dataValues.user.role
    );
    expect(hasValidUserAttributes).to.be.true;
    const hasValidChatAttributes = pastChats.every(chat =>
      chat.id && chat.createdAt
    );
    expect(hasValidChatAttributes).to.be.true;
  });
});