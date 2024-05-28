// user Tests
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import httpStatus from "http-status";

import app from "../../..";

chai.use(chaiHttp);

const router = () => chai.request(app);

// let userId: number;
// let userRole: string;
// let testUser: number = 1;
const testRole: string = "Buyer";
describe("Admin - Changing user roles", () => {
  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "ndahimana123@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userId = response.body.data.id;
        userRole = response.body.data.role;
        // console.log("New user id",userId)
        expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
        done(error);
      });
  });

  // it("Should update user role and return new user", (done) => {
  //   // console.log("Out of box New user id",userId)
  //   router()
  //     .put(`/api/users/update-role/${userId}`)
  //     .send({
  //       role: `${testRole}`
  //     })
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.a("object");
  //       expect(res.body).to.have.property("success", true);
  //       expect(res.body).to.have.property(
  //         "message",
  //         "User role updated successfully"
  //       );
  //       done(err);
  //     });
  // });

  // it("Should notify when no new role provided", (done) => {
  //   router()
  //     .put(`/api/users/update-role/${userId}`)
  //     .send({})
  //     .end((err, res) => {
  //       expect(res).to.have.status(400);
  //       expect(res.body).to.be.a("object");
  //       expect(res.body).to.have.property("success", false);
  //       expect(res.body).to.have.property(
  //         "message",
  //         "The 'role' parameter is required."
  //       )
  //       done(err);
  //     });
  // });

  it("SHould notify if the user is not found", (done) => {
    router()
      .put("/api/users/update-role/100000")
      .send({
        role: `${testRole}`
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("success", false);
        expect(res.body).to.have.property("message", "User does't exist.");
        done(err);
      });
  });

  // it("Should throw an error when Invalid ID is passed", (done) => {
  //   router()
  //     .put("/api/users/update-role/invalid_id")
  //     .send({ role: `${testRole}` })
  //     .end((err, res) => {
  //       expect(res).to.have.status(500);
  //       expect(res.body).to.be.a("object");
  //       expect(res.body).to.have.property("success", false);
  //       expect(res.body).to.have.property(
  //         "message",
  //         "An error occurred while updating the user role."
  //       );
  //       done(err);
  //     });
  // });
});
