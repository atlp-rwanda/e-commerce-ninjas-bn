import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import httpStatus from "http-status";
import app from "../../..";

chai.use(chaiHttp);

const router = () => chai.request(app);

let userId: number;

describe("Admin update User roles", () => {
  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "bonheurndahimana125@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userId = response.body.data.id;
        expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
        done(error);
      });
  });

  it("Should notify if the role is updated successfully", (done) => {
    router().put(`/api/users/update-role/${userId}`).send({ role: "Admin" }).end((error, response) => {
      expect(response.status).to.equal(httpStatus.OK);
      expect(response.body).to.have.property("message", "User role updated successfully");
      done(error);
    });
  })



  it("Should notify if no role is specified", (done) => {
    router()
      .put(`/api/users/update-role/${userId}`)
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.BAD_REQUEST);
        done(error);
      });
  });

  it("Should notify if the role is other than ['Admin', 'Buyer', 'Seller']", (done) => {
    router().put(`/api/users/update-role/${userId}`).send({ role: "Hello" }).end((error, response) => {
      expect(response.status).to.equal(httpStatus.BAD_REQUEST);
      expect(response.body).to.have.property("message", "The 'role' parameter must be one of ['Admin', 'Buyer', 'Seller'].");
      done(error);
    });
  })
});
