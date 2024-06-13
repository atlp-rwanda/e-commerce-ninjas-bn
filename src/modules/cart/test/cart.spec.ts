import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../..";
import httpStatus from "http-status";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Buyer Test cases", () => {
  let buyerWithoutCartToken: string;

  it("Buyer without cart token ", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer2@gmail.com",
        password: "Password@123"
      })
      .end((err, res) => {
        buyerWithoutCartToken = res.body.data.token;
        done();
      });
  })

  it("Should return 'No cart' when buyer have no cart.", (done) => {
    router()
      .get("/api/cart/buyer-get-cart")
      .set("Authorization", `Bearer ${buyerWithoutCartToken}`)
      .end((err, response) => {
        if (err) return done(err);

        expect(response).to.have.status(httpStatus.NOT_FOUND);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message").that.is.a("string");
        done();
      });
  });

});

describe(" buyer with cart token", () => {
  let buyerWithCartToken: string;
  it("Buyer with cart token ", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "buyer3@gmail.com",
        password: "Password@123"
      })
      .end((err, res) => {
        buyerWithCartToken = res.body.data.token;
        done(err);
      });
  })

  it("Should return Cart details when buyer have pending cart.", (done) => {
    router().get("/api/cart/buyer-get-cart")
      .set("Authorization", `Bearer ${buyerWithCartToken}`)
      .end((err, response) => {
        expect(response).to.have.status(httpStatus.OK);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message").that.is.a("string");
        expect(response.body).to.have.property("data").that.is.an("object");
        done(err)
      })
  })
})