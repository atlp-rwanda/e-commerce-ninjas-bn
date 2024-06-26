"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-shadow */
/* eslint-disable comma-dangle */
/* eslint quotes: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const sinon_1 = __importDefault(require("sinon"));
const http_status_1 = __importDefault(require("http-status"));
const index_1 = __importDefault(require("../../../index"));
const users_1 = __importDefault(require("../../../databases/models/users"));
const authRepositories_1 = __importDefault(require("../../auth/repository/authRepositories"));
const validation_1 = require("../../../middlewares/validation");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const userRepositories_1 = __importDefault(require("../repository/userRepositories"));
const models_1 = __importDefault(require("../../../databases/models"));
const helpers_1 = require("../../../helpers");
const imagePath = path_1.default.join(__dirname, "../test/testImage.jpg");
const imageBuffer = fs_1.default.readFileSync(imagePath);
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(index_1.default);
let userIdd;
describe("Update User Status test case ", () => {
    let userId = null;
    const unknownId = "10000000-0000-0000-0000-000000000000";
    let token = null;
    it("should register a new user", (done) => {
        router()
            .post("/api/auth/register")
            .send({
            email: "nda1234@gmail.com",
            password: "userPassword@123",
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.CREATED);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            userId = response.body.data.user.id;
            (0, chai_1.expect)(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
            done(error);
        });
    });
    it("Should be able to login admin", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "admin@gmail.com",
            password: "NewPassword!123",
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
            (0, chai_1.expect)(response.body.data).to.have.property("token");
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
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.CREATED);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            userId = response.body.data.user.id;
            (0, chai_1.expect)(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
            done(error);
        });
    });
    it("should update the user status successfully", (done) => {
        router()
            .put(`/api/user/admin-update-user-status/${userId}`)
            .send({ status: "disabled" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Status updated successfully.");
            done(err);
        });
    });
    it("should handle invalid user status", (done) => {
        router()
            .put(`/api/user/admin-update-user-status/${userId}`)
            .send({ status: "disableddd" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(400);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Status must be either 'enabled' or 'disabled'");
            done(err);
        });
    });
    it("should return 404 if user doesn't exist", (done) => {
        router()
            .put(`/api/user/admin-update-user-status/${unknownId}`)
            .send({ status: "disabled" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.body).to.have.property("message", "User not found");
            done(err);
        });
    });
    it("Should return 500 internal server error", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "updateUserByAttributes")
            .throws(new Error("Internal server error"));
        router()
            .put(`/api/user/admin-update-user-status/${userId}`)
            .send({ status: "disabled" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Internal server error");
            done(err);
        });
    });
});
describe("User Repository Functions", () => {
    let findOneStub;
    let updateStub;
    beforeEach(() => {
        findOneStub = sinon_1.default.stub(users_1.default, "findOne");
        updateStub = sinon_1.default.stub(users_1.default, "update");
    });
    afterEach(async () => {
        sinon_1.default.restore();
    });
    describe("getSingleUserById", () => {
        it("should return a user if found", async () => {
            const user = { id: 1, status: true };
            findOneStub.resolves(user);
            const result = await authRepositories_1.default.findUserByAttributes("id", 1);
            (0, chai_1.expect)(findOneStub.calledOnce).to.be.true;
            (0, chai_1.expect)(findOneStub.calledWith({ where: { id: 1 } })).to.be.true;
            (0, chai_1.expect)(result).to.equal(user);
        });
        it("should throw an error if there is a database error", async () => {
            findOneStub.rejects(new Error("Database error"));
            try {
                await authRepositories_1.default.findUserByAttributes("id", 1);
            }
            catch (error) {
                (0, chai_1.expect)(findOneStub.calledOnce).to.be.true;
                (0, chai_1.expect)(error.message).to.equal("Database error");
            }
        });
    });
    describe("updateUserStatus", () => {
        it("should update the user status successfully", async () => {
            updateStub.resolves([1]);
            const user = { id: 1, status: true };
            const result = await authRepositories_1.default.updateUserByAttributes("status", "enabled", "id", 1);
            (0, chai_1.expect)(updateStub.calledOnce).to.be.true;
            (0, chai_1.expect)(updateStub.calledWith({ status: true }, { where: { id: 1 } })).to
                .be.false;
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
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.CREATED);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            userIdd = response.body.data.user.id;
            (0, chai_1.expect)(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
            done(error);
        });
    });
    it("Should login admin", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "admin@gmail.com",
            password: "NewPassword!123",
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
            (0, chai_1.expect)(response.body.data).to.have.property("token");
            token = response.body.data.token;
            done(error);
        });
    });
    it("Should notify if no role is specified", (done) => {
        router()
            .put(`/api/user/admin-update-user-role/${userIdd}`)
            .set("authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("message", "The 'role' parameter is required.");
            done(error);
        });
    });
    it("Should notify if the role is other than ['admin', 'buyer', 'seller']", async () => {
        const response = await router()
            .put(`/api/user/admin-update-user-role/${userIdd}`)
            .send({ role: "Hello" })
            .set("authorization", `Bearer ${token}`);
        (0, chai_1.expect)(response.status).to.equal(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(response.body).to.have.property("message", "Only admin, buyer and seller are allowed.");
    });
    it("Should return error when invalid Id is passed", async () => {
        const response = await router()
            .put("/api/user/admin-update-user-role/invalid-id")
            .send({ role: "admin" })
            .set("authorization", `Bearer ${token}`);
        (0, chai_1.expect)(response.status).to.equal(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(response).to.have.property("status", http_status_1.default.INTERNAL_SERVER_ERROR);
    });
    it("Should update User and return updated user", (done) => {
        router()
            .put(`/api/user/admin-update-user-role/${userIdd}`)
            .send({ role: "seller" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "User role updated successfully");
            done(err);
        });
    });
    it("Should return 404 if user is not found", (done) => {
        router()
            .put(`/api/user/admin-update-user-role/${unknownId}`)
            .send({ role: "admin" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "User not found");
            done(err);
        });
    });
    it("Should return 500 internal server error", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "updateUserByAttributes")
            .throws(new Error("Internal server error"));
        router()
            .put(`/api/user/admin-update-user-role/${userIdd}`)
            .send({ role: "admin" })
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Internal server error");
            done(err);
        });
    });
});
describe("Middleware: isUsersExist", () => {
    it("should call next if users exist", async () => {
        const userCountStub = sinon_1.default.stub(users_1.default, "count").resolves(1);
        const req = {};
        const res = {};
        const next = sinon_1.default.spy();
        await (0, validation_1.isUsersExist)(req, res, next);
        (0, chai_1.expect)(next.calledOnce).to.be.true;
        userCountStub.restore();
    });
    it("should return 404 if no users exist", async () => {
        const userCountStub = sinon_1.default.stub(users_1.default, "count").resolves(0);
        const req = {};
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.spy(),
        };
        const next = sinon_1.default.spy();
        await (0, validation_1.isUsersExist)(req, res, next);
        (0, chai_1.expect)(res.status.calledWith(404)).to.be.true;
        (0, chai_1.expect)(res.json.calledWith({ error: "No users found in the database." })).to
            .be.true;
        (0, chai_1.expect)(next.called).to.be.false;
        userCountStub.restore();
    });
    it("should return 500 if there is an error", async () => {
        const userCountStub = sinon_1.default
            .stub(users_1.default, "count")
            .throws(new Error("DB error"));
        const req = {};
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.spy(),
        };
        const next = sinon_1.default.spy();
        await (0, validation_1.isUsersExist)(req, res, next);
        (0, chai_1.expect)(res.status.calledWith(500)).to.be.true;
        userCountStub.restore();
    });
});
describe("Admin Controllers", () => {
    let token = null;
    let userId;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "admin@gmail.com",
            password: "NewPassword!123",
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
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.an("object");
            done(error);
        });
    });
    it("should return one user", (done) => {
        router()
            .get(`/api/user/admin-get-user/${userId}`)
            .set("authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.an("object");
            done(error);
        });
    });
    it("Should be able to get profile", (done) => {
        router()
            .get(`/api/user/user-get-profile/`)
            .set("authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(200);
            (0, chai_1.expect)(response.body).to.be.a("object");
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
            (0, chai_1.expect)(response.status).to.equal(200);
            done(error);
        });
    });
    it("should return Internal server error", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "findUserByAttributes")
            .throws(new Error("Internal server error"));
        router()
            .get(`/api/user/admin-get-user/${userId}`)
            .set("authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("message", "Internal server error");
            done(error);
        });
    });
    it("should return internal server error", (done) => {
        sinon_1.default
            .stub(userRepositories_1.default, "getAllUsers")
            .throws(new Error("Internal server error"));
        router()
            .get("/api/user/admin-get-users")
            .set("authorization", `Bearer ${token}`)
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("message", "Internal server error");
            done(error);
        });
    });
});
describe('postChatMessage', () => {
    let testUser;
    before(async () => {
        testUser = await models_1.default.Users.create({
            id: 'cfefa1c6-af47-42f0-94d3-7c2915580ccb',
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@example.com',
            password: (0, helpers_1.hashPassword)("Password@123"),
            role: 'buyer',
            status: 'enabled'
        });
    });
    after(async () => {
        await models_1.default.Chats.destroy({ where: { userId: testUser.id } });
        await models_1.default.Users.destroy({ where: { id: testUser.id } });
    });
    it('should create a chat message and associate it with the user', async () => {
        const message = 'Test message';
        const chat = await userRepositories_1.default.postChatMessage(testUser.id, message);
        (0, chai_1.expect)(chat).to.be.an('object');
        (0, chai_1.expect)(chat).to.have.property('message', message);
        (0, chai_1.expect)(chat).to.have.property('userId', testUser.id);
        (0, chai_1.expect)(chat.user).to.be.an('object');
        (0, chai_1.expect)(chat.user).to.have.property('id', testUser.id);
        (0, chai_1.expect)(chat.user).to.have.property('firstName', testUser.firstName);
        (0, chai_1.expect)(chat.user).to.have.property('lastName', testUser.lastName);
        (0, chai_1.expect)(chat.user).to.have.property('email', testUser.email);
    });
    it('should retrieve up to 50 past chats ordered by createdAt ascending', async () => {
        const pastChats = await userRepositories_1.default.getAllPastChats();
        (0, chai_1.expect)(pastChats).to.be.an('array').with.length.at.most(50);
        const hasUsers = pastChats.every(chat => {
            return chat.dataValues.user && chat.dataValues.user.id;
        });
        console.log('hasUsers:', hasUsers);
        (0, chai_1.expect)(hasUsers).to.be.true;
        const hasValidUserAttributes = pastChats.every(chat => chat.dataValues.user &&
            chat.dataValues.user.id &&
            chat.dataValues.user.firstName &&
            chat.dataValues.user.lastName &&
            chat.dataValues.user.email &&
            chat.dataValues.user.role);
        (0, chai_1.expect)(hasValidUserAttributes).to.be.true;
        const hasValidChatAttributes = pastChats.every(chat => chat.id && chat.createdAt);
        (0, chai_1.expect)(hasValidChatAttributes).to.be.true;
    });
});
//# sourceMappingURL=user.spec.js.map