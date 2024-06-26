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
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const sinon_1 = __importDefault(require("sinon"));
const http_status_1 = __importDefault(require("http-status"));
const __1 = __importDefault(require("../../.."));
const validation_1 = require("../../../middlewares/validation");
const authRepositories_1 = __importDefault(require("../repository/authRepositories"));
const users_1 = __importDefault(require("../../../databases/models/users"));
const sessions_1 = __importDefault(require("../../../databases/models/sessions"));
const sendEmail_1 = require("../../../services/sendEmail");
const googleAuth_1 = __importDefault(require("../../../services/googleAuth"));
const passport_1 = __importDefault(require("passport"));
const authControllers_1 = __importDefault(require("../controller/authControllers"));
const helpers = __importStar(require("../../../helpers"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(__1.default);
let userId;
let verifyToken = null;
let otp = null;
describe("Authentication Test Cases", () => {
    let token;
    afterEach(async () => {
        const tokenRecord = await sessions_1.default.findOne({ where: { userId } });
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
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.CREATED);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            userId = response.body.data.user.id;
            (0, chai_1.expect)(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
            done(error);
        });
    });
    it("Should not be able to login if user not verified", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.UNAUTHORIZED);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
            done(error);
        });
    });
    it("Should not be able to login if user status is disabled", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.UNAUTHORIZED);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
            done(error);
        });
    });
    it("Should not be able to login if user account is google", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.UNAUTHORIZED);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
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
            (0, chai_1.expect)(res.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.have.property("message", "Account verified successfully, now login.");
            done(err);
        });
    });
    it("should return validation error and 400", (done) => {
        router()
            .post("/api/auth/register")
            .send({
            email: "user@example.com",
            password: "userPassword"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(400);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("message");
            done(error);
        });
    });
    it("Should be able to login a registered user", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
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
    it("Should be able to logout user", (done) => {
        router()
            .post("/api/auth/logout")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.have.property("message", "Successfully logged out");
            done(err);
        });
    });
    it("Should be able to login a registered user", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
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
    it("Should return error on logout", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "destroySessionByAttribute")
            .throws(new Error("Database Error"));
        router()
            .post("/api/auth/logout")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.have.property("message", "Internal Server error");
            done(err);
        });
    });
    it("should return internal server error on login", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "createSession")
            .throws(new Error("Database error"));
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            done(err);
        });
    });
    it("Should return validation error when no email or password given", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "user@example.com"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.a("object");
            done(error);
        });
    });
    it("Should not be able to login user with invalid Email", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "fakeemail@gmail.com",
            password: "userPassword@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("message", "Invalid Email or Password");
            done(error);
        });
    });
    it("Should not be able to login user with invalid Password", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "fakePassword@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("message", "Invalid Email or Password");
            done(error);
        });
    });
});
describe("isUserExist Middleware", () => {
    before(() => {
        __1.default.post("/auth/register", validation_1.isUserExist, (req, res) => {
            res.status(200).json({ message: "success" });
        });
    });
    afterEach(async () => {
        sinon_1.default.restore();
    });
    it("should return user already exists", (done) => {
        router()
            .post("/api/auth/register")
            .send({
            email: "ecommerceninjas45@gmail.com",
            password: "userPassword@123"
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.have.property("message", "Account already exists.");
            done(err);
        });
    });
    it("should return 'Account already exists. Please verify your account' if user exists and is not verified", (done) => {
        const mockUser = users_1.default.build({
            id: "1",
            email: "user@example.com",
            password: "hashedPassword",
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(mockUser);
        router()
            .post("/api/auth/register")
            .send({
            email: "user@example.com",
            password: "userPassword@123"
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.have.property("message", "Account already exists. Please verify your account");
            done(err);
        });
    });
    it("should return internal server error", (done) => {
        sinon_1.default
            .stub(authRepositories_1.default, "findUserByAttributes")
            .throws(new Error("Database error"));
        router()
            .post("/auth/register")
            .send({ email: "usertesting@gmail.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.have.property("message", "Database error");
            done(err);
        });
    });
    it("should call next if user does not exist", (done) => {
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(null);
        router()
            .post("/auth/register")
            .send({ email: "newuser@gmail.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(200);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "success");
            done(err);
        });
    });
});
describe("POST /auth/register - Error Handling", () => {
    let registerUserStub;
    beforeEach(() => {
        registerUserStub = sinon_1.default
            .stub(authRepositories_1.default, "createUser")
            .throws(new Error("Test error"));
    });
    afterEach(() => {
        registerUserStub.restore();
    });
    it("should return 500 and error message when an error occurs", (done) => {
        router()
            .post("/api/auth/register")
            .send({ email: "test@example.com", password: "Password@123" })
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.deep.equal({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Test error"
            });
            done(err);
        });
    });
});
describe("isAccountVerified Middleware", () => {
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 'Account not found' if user is not found", (done) => {
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(null);
        router()
            .post("/api/auth/send-verify-email")
            .send({ email: "nonexistent@example.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.body).to.have.property("message", "Account not found.");
            done(err);
        });
    });
    it("should return 'Account already verified' if user is already verified", (done) => {
        const mockUser = users_1.default.build({
            id: "1",
            email: "user@example.com",
            password: "hashedPassword",
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(mockUser);
        router()
            .post("/api/auth/send-verify-email")
            .send({ email: "user@example.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.equal(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.have.property("message", "Account already verified.");
            done(err);
        });
    });
});
describe("Authentication Test Cases", () => {
    let findUserByAttributesStub;
    let findSessionByUserIdStub;
    beforeEach(() => {
        findUserByAttributesStub = sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes");
        findSessionByUserIdStub = sinon_1.default.stub(authRepositories_1.default, "findSessionByAttributes");
    });
    afterEach(() => {
        sinon_1.default.restore();
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
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.have.property("message", "Verification email sent successfully.");
            done(err);
        });
    });
    it("should return 400 if session is not found", (done) => {
        const mockUser = { id: 1, email: "user@example.com", isVerified: false };
        const mockSession = { token: "testToken" };
        findUserByAttributesStub.resolves(mockUser);
        findSessionByUserIdStub.resolves(mockSession);
        findSessionByUserIdStub.resolves(null);
        router()
            .post("/api/auth/send-verify-email")
            .send({ email: "user@example.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.have.property("message", "Invalid token.");
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
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.have.property("message");
            done(err);
        });
    });
});
describe("sendVerificationEmail", () => {
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should throw an error when sendMail fails", async () => {
        sinon_1.default.stub(sendEmail_1.transporter, "sendMail").rejects(new Error("Network Error"));
        try {
            await (0, sendEmail_1.sendEmail)("email@example.com", "subject", "message");
        }
        catch (error) {
            (0, chai_1.expect)(error).to.be.an("error");
        }
    });
});
describe("Passport Configuration", () => {
    it("should serialize and deserialize user correctly", () => {
        const user = { id: "123", username: "testuser" };
        const doneSerialize = (err, serializedUser) => {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(serializedUser).to.deep.equal(user);
        };
        const doneDeserialize = (err, deserializedUser) => {
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(deserializedUser).to.deep.equal(user);
        };
        googleAuth_1.default.passport.serializeUser(user, doneSerialize);
        googleAuth_1.default.passport.deserializeUser(user, doneDeserialize);
    });
});
describe("Google Authentication Strategy", () => {
    it("should call the strategy callback with correct parameters", () => {
    });
});
function googleAuthenticationCallback(request, accessToken, refreshToken, profile, done) {
    userId = profile.id;
    const email = profile.emails?.[0].value || null;
    const firstName = profile.name?.givenName || null;
    const lastName = profile.name?.familyName || null;
    const picture = profile.photos?.[0].value || null;
    const accToken = accessToken;
    const user = {
        userId,
        email,
        firstName,
        lastName,
        picture,
        accToken
    };
    return done(null, user);
}
describe("Google Authentication Strategy Callback", () => {
    it("should create a user with all fields populated", () => {
        const profile = {
            id: "123",
            emails: [{ value: "test@example.com" }],
            name: { givenName: "John", familyName: "Doe" },
            photos: [{ value: "https://example.com/profile.jpg" }]
        };
        const request = {};
        const accessToken = "accessToken";
        const refreshToken = "refreshToken";
        const done = (error, user) => {
            (0, chai_1.expect)(error).to.be.null;
            (0, chai_1.expect)(user).to.deep.equal({
                userId: "123",
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe",
                picture: "https://example.com/profile.jpg",
                accToken: "accessToken"
            });
        };
        googleAuthenticationCallback(request, accessToken, refreshToken, profile, done);
    });
});
describe("Google Authentication", () => {
    describe("Google Strategy", () => {
        it("should call the done callback with user object", () => {
            const requestMock = {};
            const accessTokenMock = "mockAccessToken";
            const refreshTokenMock = "mockRefreshToken";
            const profileMock = {
                id: "mockUserId",
                emails: [{ value: "test@example.com" }],
                name: { givenName: "John", familyName: "Doe" },
                photos: [{ value: "https://example.com/profile.jpg" }]
            };
            const doneStub = sinon_1.default.stub();
            googleAuth_1.default.passport._strategies.google._verify(requestMock, accessTokenMock, refreshTokenMock, profileMock, doneStub);
            sinon_1.default.assert.calledWith(doneStub, null, {
                userId: "mockUserId",
                email: "test@example.com",
                firstName: "John",
                lastName: "Doe",
                picture: "https://example.com/profile.jpg",
                accToken: "mockAccessToken"
            });
        });
    });
});
describe("authenticateViaGoogle", () => {
    let req;
    let res;
    let next;
    let resJsonSpy;
    let resStatusSpy;
    beforeEach(() => {
        req = {};
        res = {
            json: sinon_1.default.spy(),
            status: sinon_1.default.stub().returnsThis()
        };
        next = sinon_1.default.spy();
        resJsonSpy = res.json;
        resStatusSpy = res.status;
    });
    it("should respond with 401 if authentication fails", async () => {
        const authenticateStub = sinon_1.default.stub(passport_1.default, "authenticate").callsFake((strategy, callback) => {
            callback(null, null);
            return (req, res) => { };
        });
        await googleAuth_1.default.authenticateWithGoogle(req, res, next);
        (0, chai_1.expect)(resStatusSpy.calledWith(401)).to.be.true;
        (0, chai_1.expect)(resJsonSpy.calledWith({ error: "Authentication failed" })).to.be.true;
        authenticateStub.restore();
    });
});
describe("Forget password", () => {
    let resetToken = null;
    afterEach(async () => {
        const user = await users_1.default.findOne({ where: { email: "admin@gmail.com" } });
        if (user) {
            const tokenRecord = await sessions_1.default.findOne({ where: { userId: user.dataValues.id } });
            if (tokenRecord) {
                resetToken = tokenRecord.token;
            }
        }
    });
    it("should return send email for reset password", (done) => {
        router()
            .post("/api/auth/forget-password")
            .send({ email: "admin@gmail.com" })
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.be.equal(http_status_1.default.OK);
            (0, chai_1.expect)(res.body.message).to.be.equal("Check email for reset password.");
            done(err);
        });
    });
    it("should reset password when token is valid", (done) => {
        router()
            .put(`/api/auth/reset-password/${resetToken}`)
            .send({ newPassword: "Newpassword#12" })
            .end((err, res) => {
            (0, chai_1.expect)(res.status).to.be.equal(http_status_1.default.OK);
            (0, chai_1.expect)(res.body.message).to.be.equal("Password reset successfully.");
            done(err);
        });
    });
});
describe("verifyUser middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis()
        };
        next = sinon_1.default.spy();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should respond with 404 if user is not found", async () => {
        req.body.email = "test@example.com";
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(null);
        await (0, validation_1.verifyUser)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.NOT_FOUND,
            message: "Account not found."
        });
    });
    it("should respond with 400 if user is not verified", async () => {
        const mockUser = users_1.default.build({
            id: "userId",
            email: "test@example.com",
            password: "hashedpassword",
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        req.body.email = "test@example.com";
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(mockUser);
        await (0, validation_1.verifyUser)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.BAD_REQUEST,
            message: "Account is not verified."
        });
    });
    it("should handle errors and respond with 500", async () => {
        req.body.email = "test@example.com";
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").rejects(new Error("Unexpected error"));
        await (0, validation_1.verifyUser)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: "Unexpected error"
        });
    });
    it("should call next if user is found and verified", async () => {
        req.body.email = "test@example.com";
        const user = users_1.default.build({ id: "userId", isVerified: true });
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(user);
        await (0, validation_1.verifyUser)(req, res, next);
        (0, chai_1.expect)(next).to.have.been.calledOnce;
        (0, chai_1.expect)(req.user).to.deep.equal(user);
    });
});
describe("isSessionExist middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            user: { id: "userId" },
            body: { newPassword: "newPassword123!" }
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis()
        };
        next = sinon_1.default.spy();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should respond with 400 if session does not exist", async () => {
        sinon_1.default.stub(authRepositories_1.default, "findSessionByAttributes").resolves(null);
        await (0, validation_1.isSessionExist)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.BAD_REQUEST,
            message: "Invalid token."
        });
    });
    it("should handle errors and respond with 500", async () => {
        sinon_1.default.stub(authRepositories_1.default, "findSessionByAttributes").rejects(new Error("Unexpected error"));
        await (0, validation_1.isSessionExist)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: "Unexpected error"
        });
    });
});
describe("verifyEmail", () => {
    it("should handle errors and respond with 500", async () => {
        const req = {
            user: { id: "userId" },
            session: { token: "token" }
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis()
        };
        const error = new Error("Unexpected error");
        sinon_1.default.stub(authRepositories_1.default, "destroySessionByAttribute").throws(error);
        await authControllers_1.default.verifyEmail(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(500);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: 500,
            message: "Unexpected error"
        });
        sinon_1.default.restore();
    });
});
describe("forgetPassword", () => {
    it("should handle errors and respond with 500", async () => {
        const req = {
            user: { id: "userId", email: "user@example.com" },
            headers: { "user-device": "device" }
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis()
        };
        const error = new Error("Unexpected error");
        sinon_1.default.stub(authRepositories_1.default, "createSession").throws(error);
        await authControllers_1.default.forgetPassword(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(500);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Unexpected error"
        });
        sinon_1.default.restore();
    });
});
describe("resetPassword", () => {
    it("should handle errors and respond with 500", async () => {
        const req = {
            user: { id: "userId", password: "newPassword" }
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis()
        };
        const error = new Error("Unexpected error");
        sinon_1.default.stub(authRepositories_1.default, "updateUserByAttributes").throws(error);
        await authControllers_1.default.resetPassword(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(500);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Unexpected error"
        });
        sinon_1.default.restore();
    });
});
describe("updateUser2FA", () => {
    let req;
    let res;
    let token = null;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "buyer@gmail.com",
            password: "Password@123"
        })
            .end((error, response) => {
            token = response.body.data.token;
            done(error);
        });
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should enable 2FA for the user and return success message", (done) => {
        router()
            .put("/api/auth/enable-2f")
            .set("Authorization", `Bearer ${token}`)
            .send({ is2FAEnabled: true })
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.have.property("status", http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.have.property("message", "2FA enabled successfully.");
            (0, chai_1.expect)(response.body).to.have.property("data");
            done(error);
        });
    });
    it("should return internal server error message if updating 2FA fails", (done) => {
        const errorMessage = "Failed to enable 2FA";
        sinon_1.default
            .stub(authRepositories_1.default, "updateUserByAttributes")
            .throws(new Error(errorMessage));
        router()
            .put("/api/auth/enable-2f")
            .set("Authorization", `Bearer ${token}`)
            .send({ is2FAEnabled: true })
            .end((error, response) => {
            (0, chai_1.expect)(response.body).to.have.property("status", http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(response.body).to.have.property("message", errorMessage);
            done(error);
        });
    });
});
describe("verifyUserCredentials Middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            body: {
                email: "user@example.com",
                password: "Password@123"
            },
            headers: {}
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub()
        };
        next = sinon_1.default.stub();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 400 if the user is not found", (done) => {
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(null);
        router()
            .post("/api/auth/login")
            .send({
            email: "example@gmail.com",
            password: "Password@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(400);
            (0, chai_1.expect)(response.body.message).to.equal("Invalid Email or Password");
            done(error);
        });
    });
    it("should return 400 if the password does not match", async () => {
        const user = {
            id: 1,
            email: req.body.email,
            password: "hashedPassword",
            is2FAEnabled: false
        };
        sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(user);
        sinon_1.default.stub(helpers, "comparePassword").resolves(false);
        await (0, validation_1.verifyUserCredentials)(req, res, next);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Invalid Email or Password"
        });
        (0, chai_1.expect)(next).not.to.have.been.called;
    });
    it("should send OTP email if 2FA is enabled", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "buyer@gmail.com",
            password: "Password@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body.message).to.equal("Check your Email for OTP Confirmation");
            userId = response.body.UserId.userId;
            done(error);
        });
    });
});
describe("verifyOtp", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";
    let findUserStub, findSessionStub, destroySessionStub;
    afterEach(async () => {
        if (findUserStub)
            findUserStub.restore();
        if (findSessionStub)
            findSessionStub.restore();
        if (destroySessionStub)
            destroySessionStub.restore();
        const otpRecord = await sessions_1.default.findOne({ where: { userId } });
        if (otpRecord) {
            otp = otpRecord.dataValues.otp;
        }
    });
    it("should send otp when user is has enabled 2FA", (done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "buyer1@gmail.com",
            password: "Password@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body.message).to.equal("Check your Email for OTP Confirmation");
            userId = response.body.UserId.userId;
            done(error);
        });
    });
    it("should return 400 if sessionData is null or has no OTP", async () => {
        const user = users_1.default.build({ id: validUUID });
        findUserStub = sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(user);
        findSessionStub = sinon_1.default.stub(authRepositories_1.default, "findSessionByUserIdOtp").resolves(null); // Simulate no session data
        const res = await chai_1.default.request(__1.default)
            .post(`/api/auth/verify-otp/${validUUID}`)
            .send({ otp: "123456" });
        (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(res.body.message).to.equal("Invalid or expired code.");
    });
    it("should return 400 if OTP is expired", async () => {
        const user = users_1.default.build({ id: validUUID });
        const sessionData = sessions_1.default.build({ otp: "123456", otpExpiration: new Date(Date.now() - 1000) });
        findUserStub = sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(user);
        findSessionStub = sinon_1.default.stub(authRepositories_1.default, "findSessionByUserIdOtp").resolves(sessionData);
        destroySessionStub = sinon_1.default.stub(authRepositories_1.default, "destroySessionByAttribute").resolves();
        const res = await chai_1.default.request(__1.default)
            .post(`/api/auth/verify-otp/${validUUID}`)
            .send({ otp: "123456" });
        (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
        (0, chai_1.expect)(res.body.message).to.equal("OTP expired.");
    });
    it("should return 200 and proceed if OTP is valid and not expired", (done) => {
        router()
            .post(`/api/auth/verify-otp/${userId}`)
            .send({ otp: otp })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.an("object");
            done(error);
        });
    });
    it("should return 404 if user is not found", async () => {
        findUserStub = sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").resolves(null);
        const res = await chai_1.default.request(__1.default)
            .post(`/api/auth/verify-otp/${validUUID}`)
            .send({ otp: "123456" });
        (0, chai_1.expect)(res).to.have.status(http_status_1.default.NOT_FOUND);
        (0, chai_1.expect)(res.body.message).to.equal("User not found.");
    });
    it("should return 500 if there is a server error", async () => {
        findUserStub = sinon_1.default.stub(authRepositories_1.default, "findUserByAttributes").rejects(new Error("Internal Server Error"));
        const res = await chai_1.default.request(__1.default)
            .post(`/api/auth/verify-otp/${validUUID}`)
            .send({ otp: "123456" });
        (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.body.message).to.equal("Internal Server Error");
    });
});
describe("Validation tests", () => {
    it("Should reject invalid email", (done) => {
        router().post("/api/auth/login")
            .send({
            email: "mytest_email15456@gmail.com",
            password: "Password@123"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.has.property("message");
            (0, chai_1.expect)(response.body.message).to.equal("Invalid Email or Password");
            done(error);
        });
    });
});
//# sourceMappingURL=auth.spec.js.map