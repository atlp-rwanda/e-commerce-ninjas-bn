// user Tests
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../index";

chai.use(chaiHttp);

const router = () => chai.request(app);

const testUserId = 1; 

describe("User Account Status Management", () => {
  
  describe("Disable User Account", () => {
    it("Should return 404 if user doesn't exist", (done) => {
        router()
          .put("/api/admin-change-status/disable/100000") 
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("success", false);
            expect(res.body).to.have.property("message", "User doesn't exist.");
            done(err);
          });
      });

    it("Should disable the user account successfully", (done) => {
      router()
        .put(`/api/admin-change-status/disable/${testUserId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("message", "User account disabled successfully");
          done(err);
        });
    });

    it("Should handle server errors", (done) => {
      router()
        .put("/api/admin-change-status/disable/invalid_id")
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message", "An error occurred while disabling the user account.");
          done(err);
        });
    });
  });

  describe("Enable User Account", () => {
    it("Should return 404 if user doesn't exist", (done) => {
      router()
        .put("/api/admin-change-status/enable/100000")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message", "User doesn't exist.");
          done(err);
        });
    });

    it("Should enable the user account successfully", (done) => {
      router()
        .put(`/api/admin-change-status/enable/${testUserId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("message", "User account enabled successfully");
          done(err);
        });
    });

    it("Should handle server errors", (done) => {
      router()
        .put("/api/admin-change-status/enable/invalid_id") 
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message", "An error occurred while enabling the user account.");
          done(err);
        });
    });
  });
});
