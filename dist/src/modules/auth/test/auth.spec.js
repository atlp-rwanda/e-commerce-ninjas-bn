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
const index_1 = __importDefault(require("../../../index"));
const chai_http_1 = __importDefault(require("chai-http"));
const chai_1 = __importStar(require("chai"));
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(index_1.default);
describe("Auth Test Cases", () => {
    const realEmail = "testinguser@gmail.com";
    const realPassword = "testingpassword";
    it("Should return validation error when no email or password given", (done) => {
        router()
            .post("/api/user/login")
            .send({
            email: realEmail
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(400);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("status", false);
            (0, chai_1.expect)(response.body).to.have.property("message").that.is.an("array");
            done(error);
        });
    });
    it("Should not be able to login user with invalid Email", (done) => {
        router()
            .post("/api/user/login")
            .send({
            email: "fakeemail@gmail.com",
            password: "fakepassword"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(400);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("status", false);
            (0, chai_1.expect)(response.body).to.have.property("message", "Invalid Email or Password");
            done(error);
        });
    });
    it("Should not be able to login user with invalid Password", (done) => {
        router()
            .post("/api/user/login")
            .send({
            email: realEmail,
            password: "fakepassword"
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(400);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("status", false);
            (0, chai_1.expect)(response.body).to.have.property("message", "Invalid Email or Password");
            done(error);
        });
    });
    it("Should be able to login user with valid credentials", (done) => {
        router()
            .post("/api/user/login")
            .send({
            email: realEmail,
            password: realPassword
        })
            .end((error, response) => {
            (0, chai_1.expect)(response).to.have.status(200);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("status", true);
            (0, chai_1.expect)(response.body).to.have.property("message").that.is.an("object");
            (0, chai_1.expect)(response.body.message).to.have.property("token");
            done(error);
        });
    });
});
//# sourceMappingURL=auth.spec.js.map