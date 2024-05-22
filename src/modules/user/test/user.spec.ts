import app from "../../../index";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("User Test Cases", () => {
    let token = "";
    const realEmail = "testinguser@gmail.com";
    const realPassword = "P@ssword123";


    it("Should return validation error when no email or password given", (done) => {
        router()
            .post("/api/user/login")
            .send({
                email: realEmail,
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                expect(response.body).to.be.a("object");
                expect(response.body).to.have.property("status", false);
                expect(response.body).to.have.property("message").that.is.an("array");
                done(error);
            });
    });
    it("Should not be able to login user with invalid Email", (done) => {
        router()
            .post("/api/user/login")
            .send({
                email: "fakeEmail@gmail.com",
                password: "fakeP@ssword@123"
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                expect(response.body).to.be.a("object");
                expect(response.body).to.have.property("status", false);
                expect(response.body).to.have.property("message", "Invalid Email or Password");
                done(error);
            });
    });
    it("Should not be able to login user with invalid Password", (done) => {
        router()
            .post("/api/user/login")
            .send({
                email: realEmail,
                password: "fakeP@ssword@123"
            })
            .end((error, response) => {
                expect(response).to.have.status(400);
                expect(response.body).to.be.a("object");
                expect(response.body).to.have.property("status", false);
                expect(response.body).to.have.property("message", "Invalid Email or Password");
                done(error);
            });
    });

    it("Should be able to login user with valid credentials", (done) => {
        router()
            .post("/api/user/login")
            .send({
                email: realEmail,
                password: realPassword,
            })
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.a("object");
                expect(response.body).to.have.property("status", true);
                expect(response.body).to.have.property("message").that.is.an("object");
                expect(response.body.message).to.have.property("token");
                token = response.body.message.token;
                done(error);
            });
    });

});