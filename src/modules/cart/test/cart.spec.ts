/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import httpStatus from "http-status";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Buyer Test cases", () => {
  it("Should return 'No cart' when buyer has no cart.", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer2@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        if (error) done(error);
        const buyerWithoutCartToken = response.body.data.token;

        router()
          .get("/api/cart/buyer-get-cart")
          .set("Authorization", `Bearer ${buyerWithoutCartToken}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(httpStatus.NOT_FOUND);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message").that.is.a("string");
            done();
          });
      });
  });

  it("Should return Cart details when buyer has a pending cart.", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer@gmail.com",
        password: "Password@123"
      })
      .end((error, response) => {
        if (error) done(error);
        const buyerWithCartToken = response.body.data.token;

        router()
          .get("/api/cart/buyer-get-cart")
          .set("Authorization", `Bearer ${buyerWithCartToken}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(httpStatus.OK);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("message").that.is.a("string");
            expect(res.body).to.have.property("data").that.is.an("object");
            done();
          });
      });
  });
});
