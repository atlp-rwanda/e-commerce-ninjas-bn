// user Tests
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import httpStatus from "http-status";
import app from "../../../index";
import userRepo from "../repository/userRepositories";
import db from "../../../databases/models/index";


const { Users } = db;

chai.use(chaiHttp);

const router = () => chai.request(app);

const testUserId = 1; 

describe("User Account Status Management", () => {
  let getUserStub: sinon.SinonStub;
  let updateUserStub: sinon.SinonStub;

  beforeEach(() => {
    getUserStub = sinon.stub(userRepo, "getSingleUserById");
    updateUserStub = sinon.stub(userRepo, "updateUserStatus");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Disable User Account", () => {
    it("Should return 404 if user doesn't exist", (done) => {
        getUserStub.resolves(null);
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
      getUserStub.resolves({ id: testUserId, status: true });
      updateUserStub.resolves();
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

    it("Should handle invalid user ID", (done) => {
      router()
        .put("/api/admin-change-status/disable/invalid_id")
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message", "Invalid user ID");
          done(err);
        });
    });

    it("Should handle server errors", (done) => {
      getUserStub.rejects(new Error("Database error"));
      router()
        .put(`/api/admin-change-status/disable/${testUserId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
          expect(res.body).to.have.property("message");
          done(err);
        });
    });
  });

  describe("Enable User Account", () => {
    it("Should return 404 if user doesn't exist", (done) => {
      getUserStub.resolves(null);
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
      getUserStub.resolves({ id: testUserId, status: false });
      updateUserStub.resolves();
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

    it("Should handle invalid user ID", (done) => {
      router()
        .put("/api/admin-change-status/enable/invalid_id") 
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message", "Invalid user ID");
          done(err);
        });
    });

    it("Should handle server errors", (done) => {
      getUserStub.rejects(new Error("Database error"));
      router()
        .put(`/api/admin-change-status/enable/${testUserId}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
          expect(res.body).to.have.property("message");
          done(err);
        });
    });
  });
});

// userRepositories.test.ts
describe("User Repository Functions", () => {
  let findOneStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Users, "findOne");
    updateStub = sinon.stub(Users, "update");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getSingleUserById", () => {
    it("should return a user if found", async () => {
      const user = { id: 1, status: true };
      findOneStub.resolves(user);

      const result = await userRepo.getSingleUserById(1);

      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { id: 1 } })).to.be.true;
      expect(result).to.equal(user);
    });

    it("should return null if user not found", async () => {
      findOneStub.resolves(null);

      const result = await userRepo.getSingleUserById(1000);

      expect(findOneStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });

    it("should throw an error if there is a database error", async () => {
      findOneStub.rejects(new Error("Database error"));

      try {
        await userRepo.getSingleUserById(1);
      } catch (error) {
        expect(findOneStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user status successfully", async () => {
      updateStub.resolves([1]); // Sequelize returns an array with the number of affected rows

      const result = await userRepo.updateUserStatus(1, false);

      expect(updateStub.calledOnce).to.be.true;
      expect(updateStub.calledWith({ status: false }, { where: { id: 1 } })).to.be.true;
      expect(result).to.eql([1]);
    });

    it("should throw an error if there is a database error", async () => {
      updateStub.rejects(new Error("Database error"));

      try {
        await userRepo.updateUserStatus(1, false);
      } catch (error) {
        expect(updateStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });
});
