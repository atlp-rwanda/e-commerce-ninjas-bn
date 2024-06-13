/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import httpStatus from "http-status";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Buyer Test cases", () => {
  let buyerWithCartToken: string;
  let buyerWithoutCartToken: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        if (error) done(error);
        buyerWithCartToken = response.body.data.token;
        router()
          .post("/api/auth/login")
          .send({
            email: "buyer2@gmail.com",
            password: "Password@123"
          })
          .end((err, res) => {
            if (err) done(err);
            buyerWithoutCartToken = res.body.data.token;
            done();
          })
      })
  })
  it("Should return 'No cart' when buyer have no cart.", (done) => {
    router().get("/api/cart/buyer-get-cart")
      .set("Authorization", `Bearer ${buyerWithoutCartToken}`)
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(httpStatus.NOT_FOUND);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message").that.is.a("string");
        done()
      })
  })
  it("Should return Cart details when buyer have pending cart.", (done) => {
    router().get("/api/cart/buyer-get-cart")
      .set("Authorization", `Bearer ${buyerWithCartToken}`)
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message").that.is.a("string");
        expect(response.body).to.have.property("data").that.is.an("object");
        done()
      })
  })
})