// user Tests
import chai, { expect } from "chai"
import chaiHttp from "chai-http";
import app from "../../..";
import db from "../../../databases/models/index";


chai.use(chaiHttp);
const { Users } = db
const router = () => chai.request(app);
describe("User Test Cases", () => {
  afterEach(async () => {
    await Users.destroy({ where: {} });
  });

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
        expect(response.status).equal(400);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.be.a("array");
        expect(response.body.message).be.equal("Password must contain both letters and numbers")
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
        expect(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("user");
        expect(response.body).to.have.property("token");
        expect(response.body.user).to.have.property("firstName")
        expect(response.body.user).to.have.property("lastName")
        expect(response.body.user).to.have.property("email")
        expect(response.body.user).to.have.property("phone")
        expect(response.body.user).to.have.property("password")
        expect(response.body.user).to.have.property("role")
        expect(response.body.user).to.have.property("id")
        expect(response.body.user).to.have.property("gender")
        expect(response.body.user).to.have.property("language")
        expect(response.body.user).to.have.property("currency")
        expect(response.body.user).to.have.property("profilePicture")
        expect(response.body.user).to.have.property("birthDate")
        expect(response.body.user).to.have.property("status",false)
        expect(response.body.user).to.have.property("isVerified",false)
        expect(response.body.user).to.have.property("is2FAEnabled",false)
        expect(response.body.user).to.have.property("createdAt")
        expect(response.body.user).to.have.property("updatedAt")
        done(error);
      });
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
        expect(400)
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("User already exists.")
        done(err);
      });
  });
})