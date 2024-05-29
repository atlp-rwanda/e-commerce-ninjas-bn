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

  it("Should notify if the user is not found", (done) => {
    router().put(`/api/users/update-role/1039482383218223289321242545`).send({ role: "Admin" }).end((error, response) => {
      expect(response.status).to.equal(httpStatus.NOT_FOUND);
      expect(response.body).to.have.property("message", "User doesn't exist.");
      done(error);
    });
  })


  it("Should notify if the invalid id is sent to server", (done) => {
    router().put(`/api/users/update-role/invalid_id`).send({ role: "Admin" }).end((error, response) => {
      expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
      expect(response.body).to.have.property("message", "An error occurred while updating the user role.");
      done(error);
    });
  })


});
