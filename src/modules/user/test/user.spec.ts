import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import httpStatus from "http-status";
import app from "../../..";

chai.use(chaiHttp);

const router = () => chai.request(app);


describe("Admin update User roles", () => {

  let userId: number = null;


  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "niyofo8179@acuxi.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userId = response.body.data.user.id;
        expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
        done(error);
      });
  });

  it("Should notify if no role is specified", async () => {

    const response = await router()
      .put(`/api/users/admin-update-role/${userId}`);

    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property("message");
  });

  it("Should notify if the role is other than ['Admin', 'Buyer', 'Seller']", async () => {

    const response = await router()
      .put(`/api/users/admin-update-role/${userId}`)
      .send({ role: "Hello" });

    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property("message", "The 'role' parameter must be one of ['Admin', 'Buyer', 'Seller'].");
  });

  it("Should return error when invalid Id is passed", async () => {
    const response = await router()
      .put("/api/users/admin-update-role/invalid-id")
      .send({ role: "Admin" });

    expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
  });


  it("Should update User and return updated user", (done) => {
    router()
      .put(`/api/users/admin-update-role/${userId}`)
      .send({ role: "Admin" })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User role updated successfully");
        done(err);
      });
  });



  it("Should return 404 if user is not found", (done) => {
    router().put("/api/users/admin-update-role/10001").send({ role: "Admin" }).end((err, res) => {
      expect(res).to.have.status(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("message", "User doesn't exist.")
      done(err)
    })
  })


});























