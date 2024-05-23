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
const __1 = __importDefault(require("../../.."));
const models_1 = __importDefault(require("../../../databases/models")); // Adjust the import based on your project structure
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(__1.default);
const { Users } = models_1.default;
describe("User Test Cases", () => {
    it("should return Password must contain both letters and numbers", (done) => {
        router()
            .post("/api/user/register")
            .send({
            firstName: "TestUser",
            lastName: "TestUser",
            email: "usertesting@gmail.com",
            phone: 123456789,
            password: "TestUser@123",
            gender: "male",
            language: "English",
            currency: "USD",
            birthDate: "2000-12-12",
            role: "buyer"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).equal(400);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("message");
            done(error);
        });
    });
    it("Should be able to register new user", (done) => {
        router()
            .post("/api/user/register")
            .send({
            firstName: "TestUser",
            lastName: "TestUser",
            email: "usertesting@gmail.com",
            phone: 123456789,
            password: "TestUser123",
            gender: "male",
            language: "English",
            currency: "USD",
            birthDate: "2000-12-12",
            role: "buyer"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).equal(200);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("user");
            (0, chai_1.expect)(response.body).to.have.property("token");
            (0, chai_1.expect)(response.body.user).to.have.property("firstName");
            (0, chai_1.expect)(response.body.user).to.have.property("lastName");
            (0, chai_1.expect)(response.body.user).to.have.property("email");
            (0, chai_1.expect)(response.body.user).to.have.property("phone");
            (0, chai_1.expect)(response.body.user).to.have.property("password");
            (0, chai_1.expect)(response.body.user).to.have.property("role");
            (0, chai_1.expect)(response.body.user).to.have.property("id");
            (0, chai_1.expect)(response.body.user).to.have.property("gender");
            (0, chai_1.expect)(response.body.user).to.have.property("language");
            (0, chai_1.expect)(response.body.user).to.have.property("currency");
            (0, chai_1.expect)(response.body.user).to.have.property("profilePicture");
            (0, chai_1.expect)(response.body.user).to.have.property("birthDate");
            (0, chai_1.expect)(response.body.user).to.have.property("status", true);
            (0, chai_1.expect)(response.body.user).to.have.property("isVerified", false);
            (0, chai_1.expect)(response.body.user).to.have.property("is2FAEnabled", false);
            (0, chai_1.expect)(response.body.user).to.have.property("createdAt");
            (0, chai_1.expect)(response.body.user).to.have.property("updatedAt");
            done(error);
        });
    });
});
describe("User Registration", () => {
    afterEach(async () => {
        await Users.destroy({ where: {} });
    });
    it("should return user already exists", (done) => {
        router()
            .post("/api/user/register")
            .send({
            firstName: "TestUser",
            lastName: "TestUser",
            email: "usertesting@gmail.com",
            phone: 123456789,
            password: "TestUser123",
            gender: "male",
            language: "English",
            currency: "USD",
            birthDate: "2000-12-12",
            role: "buyer"
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(400);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message");
            (0, chai_1.expect)(res.body.message).to.equal("User already exists.");
            done(err);
        });
    });
});
//# sourceMappingURL=user.spec.js.map