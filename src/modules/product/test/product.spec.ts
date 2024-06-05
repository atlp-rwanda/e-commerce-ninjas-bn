/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../../index";
import productRepositories from "../repository/productRepositories";

chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Seller test cases", () => {

  let token: string;
  before((done) => {
    router()
      .post("/api/auth/login")
      .send({ email: "testingseller@gmail.com", password: "$321!Pass!123$" })
      .end((err, res) => {
        token = res.body.data.token;
        done(err);
      })
  });


  it("should return statistics of Seller in specified timeframe", (done) => {
    router()
      .post("/api/product/statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        done(error);
      });
  });

  it("should catch server error during fetching statistics", (done) => {
    sinon
      .stub(productRepositories, "getOrdersPerTimeframe")
      .throws(new Error("Database error"));
    router()
      .post("/api/product/statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      })
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.INTERNAL_SERVER_ERROR);
        done(err);
      });
  });

});
