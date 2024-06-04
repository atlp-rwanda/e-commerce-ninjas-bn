/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../../index";



chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Seller test cases", () => {


  it("should return statistics of Seller in specified timeframe", (done) => {
    router()
      .post("/api/seller/statistics")
      .send({
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
       done(error);
      });
  });

});
