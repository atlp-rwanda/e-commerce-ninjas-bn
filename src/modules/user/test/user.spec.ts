/* eslint-disable comma-dangle */
/* eslint quotes: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon, { SinonStub } from "sinon";
import httpStatus from "http-status";
import app from "../../../index";
import Users from "../../../databases/models/users";
import authRepositories from "../../auth/repository/authRepositories"
import { isUsersExist } from "../../../middlewares/validation";
import { Op } from "sequelize";
import path from "path";
import fs from 'fs'
import uploadImages from "../../../helpers/uploadImage";
import { v2 as cloudinary } from "cloudinary";
const imagePath = path.join(__dirname, "../test/testImage.jpg");
const imageBuffer = fs.readFileSync(imagePath)


chai.use(chaiHttp);
const router = () => chai.request(app);

describe("Update User Status test case ", () => {
  let getUserStub;
  let updateUserStub;
  let userId = null;
  const unknownId = "10000000-0000-0000-0000-000000000000";
  let token;

  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "nda1234@gmail.com",
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

  it("Should be able to login admin", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        expect(response.body.data).to.have.property("token");
        token = response.body.data.token;
        done(error);
      });
  });

  it("should update the user status successfully", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${userId}`)
      .send({ status: "disabled" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "Status updated successfully.");
        done(err);
      });
  });

  it("should handle invalid user status", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${userId}`)
      .send({ status: "disableddd" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "Status must be either 'enabled' or 'disabled'");
        done(err);
      });
  });

  it("should return 404 if user doesn't exist", (done) => {
    router()
      .put(`/api/user/admin-update-user-status/${unknownId}`)
      .send({ status: "disabled" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.NOT_FOUND);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("status", httpStatus.NOT_FOUND);
        expect(res.body).to.have.property("message", "User not found");
        done(err);
      });
  });
});

describe("User Repository Functions", () => {
  let findOneStub: sinon.SinonStub;
  let updateStub: sinon.SinonStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Users, "findOne");
    updateStub = sinon.stub(Users, "update");
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe("getSingleUserById", () => {
    it("should return a user if found", async () => {
      const user = { id: 1, status: true };
      findOneStub.resolves(user);
      const result = await authRepositories.findUserByAttributes("id", 1);
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ where: { id: 1 } })).to.be.true;
      expect(result).to.equal(user);
    });

    it("should throw an error if there is a database error", async () => {
      findOneStub.rejects(new Error("Database error"));
      try {
        await authRepositories.findUserByAttributes("id", 1);
      } catch (error) {
        expect(findOneStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user status successfully", async () => {
      updateStub.resolves([1]);
      const user = { id: 1, status: true };
      const result = await authRepositories.updateUserByAttributes("status", "enabled", "id", 1);
      expect(updateStub.calledOnce).to.be.true;
      expect(updateStub.calledWith({ status: true }, { where: { id: 1 } })).to.be.false;
    });

    it("should throw an error if there is a database error", async () => {
      updateStub.rejects(new Error("Database error"));
      try {
        await authRepositories.updateUserByAttributes("status", "enabled", "id", 1);
      } catch (error) {
        expect(updateStub.calledOnce).to.be.true;
        expect(error.message).to.equal("Database error");
      }
    });
  });
});



describe("Admin update User roles", () => {
  let userIdd: number ;
  let token = null;
  const unknownId = "10000000-0000-0000-0000-000000000000";


  it("should register a new user", (done) => {
    router()
      .post("/api/auth/register")
      .send({
        email: "nda12345@gmail.com",
        password: "userPassword@123"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.CREATED);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("data");
        userIdd = response.body.data.user.id;
        expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
        done(error);
      });
  });

  it("Should be able to login a registered user", (done) => {
    router()
      .post("/api/auth/login")
      .send({
        email:"admin@gmail.com",
        password:"$321!Pass!123$"
      })
      .end((error, response) => {
        expect(response.status).to.equal(httpStatus.OK);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("data");
        expect(response.body.message).to.be.a("string");
        expect(response.body.data).to.have.property("token");
        token = response.body.data.token;
        done(error);
      });
  });

  it("Should notify if no role is specified", async () => {

    const response = await router()
      .put(`/api/user/admin-update-role/${userIdd}`)
      .set("authorization", `Bearer ${token}`);

    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property("message");
  });

  it("Should notify if the role is other than ['admin', 'buyer', 'seller']", async () => {

    const response = await router()
      .put(`/api/user/admin-update-role/${userIdd}`)
      .send({ role: "Hello" })
      .set("authorization", `Bearer ${token}`)
    expect(response.status).to.equal(httpStatus.BAD_REQUEST);
    expect(response.body).to.have.property("message", "Only admin, buyer and seller are allowed.");
  });

  it("Should return error when invalid Id is passed", async () => {
    const response = await router()
      .put("/api/user/admin-update-role/invalid-id")
      .send({ role: "admin" })
      .set("authorization", `Bearer ${token}`);

    expect(response.status).to.equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response).to.have.property("status", httpStatus.INTERNAL_SERVER_ERROR);
  });


  it("Should update User and return updated user", (done) => {
    router()
      .put(`/api/user/admin-update-role/${userIdd}`)
      .send({ role: "admin" })
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(httpStatus.OK);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User role updated successfully");
        done(err);
      });
  });



  it("Should return 404 if user is not found", (done) => {
    router().put(`/api/user/admin-update-role/${unknownId}`)
    .send({ role: "admin" })
    .set("authorization", `Bearer ${token}`)
    .end((err, res) => {
      expect(res).to.have.status(httpStatus.NOT_FOUND);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("message", "User not found")
      done(err)
    })
  })


});

describe("Middleware: isUsersExist", () => {
  it("should call next if users exist", async () => {
    const userCountStub = sinon.stub(Users, "count").resolves(1);
    const req: any = {} ;
    const res: any = {} ;
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(next.calledOnce).to.be.true;
    userCountStub.restore();
  });

  it("should return 404 if no users exist", async () => {
    const userCountStub = sinon.stub(Users, "count").resolves(0);
    const req: any = {} ;
    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    } ;
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ error: "No users found in the database." })).to.be.true;
    expect(next.called).to.be.false;
    userCountStub.restore();
  });

  it("should return 500 if there is an error", async () => {
    const userCountStub = sinon.stub(Users, "count").throws(new Error("DB error"));
    const req: any = {} ;
    const res: any = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    } ;
    const next = sinon.spy();

    await isUsersExist(req, res, next);

    expect(res.status.calledWith(500)).to.be.true;
    userCountStub.restore();
  });
});

describe("Admin Controllers", () => {
  let token: string = null;
  let userId:string;
  beforeEach((done)=>{
    router()
    .post("/api/auth/login")
    .send({
      email:"admin@gmail.com",
      password:"$321!Pass!123$"
    })
    .end((error, response) => {
      token = response.body.data.token;
      done(error);
    });
  })

  it("should return all users", (done) => {
    router()
    .get("/api/user/admin-get-users")
    .set("authorization", `Bearer ${token}`)
    .end((error, response) => {
      userId = response.body.data[0].id;

       expect(response.status).to.equal(httpStatus.OK);
       expect(response.body).to.be.an("object");
       done(error)
     });
  });

  it("should return one user", (done) => {
    router()
    .get(`/api/user/admin-get-user/${userId}`)
    .set("authorization", `Bearer ${token}`)
    .end((error, response) => {
       expect(response.status).to.equal(httpStatus.OK);
       expect(response.body).to.be.an("object");
       done(error)
     });
  });
});

describe("updateUserProfile", () => {
  let profileId :number = null;  
let token

it("should register a new user", (done) => {
router()
  .post("/api/auth/register")
  .send({
    email: "salt23@gmail.com",
    password: "userPassword@123"
  })
  .end((error, response) => {
    expect(response.status).to.equal(httpStatus.CREATED);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("data");
    profileId = response.body.data.user.id;
    expect(response.body).to.have.property("message", "Account created successfully. Please check email to verify account.");
    done(error);
  });
});

it("Should be able to login a registered user", (done) => {
  router()
    .post("/api/auth/login")
    .send({
      email: "salt23@gmail.com",
      password: "userPassword@123"
    })
    .end((error, response) => {
      expect(response.status).to.equal(httpStatus.OK);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("data");
      expect(response.body.message).to.be.a("string");
      expect(response.body.data).to.have.property("token");
      token = response.body.data.token;
      done(error);
    });
});


it("Should be able to get profile", (done) => {
router()
  .get(`/api/user/user-get-profile/`)
  .set("authorization", `Bearer ${token}`)
  .end((error, response) => {
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    done(error);
  });
});

it("should update profile ", (done) => {
  router().put(`/api/user/user-update-profile/`)
  .set("Authorization", `Bearer ${token}`)
    .field('firstName', 'MANISHIMWE')
    .field('lastName', 'Salton Joseph')
    .field('phone', '787312593')
    .field('gender', 'male')
    .field('birthDate', '1943-02-04')
    .field('language', 'english')
    .field('currency', 'USD')
    .attach("profilePicture",imageBuffer,'testImage.jpg')
  .end((error, response) => {
    
      expect(response.status).to.equal(200); 
      done(error);
  });
});

describe('uploadImages', () => {
  let uploadStub: sinon.SinonStub;

  beforeEach(() => {
    uploadStub = sinon.stub(cloudinary.uploader, 'upload');
  });

  afterEach(() => {
    uploadStub.restore();
  });

  it('should upload an image and return the public_id and secure_url', async () => {
    const fileToUpload = { path: 'path/to/file.jpg' };
    const mockResult = {
      public_id: 'mock_public_id',
      secure_url: 'https://mock_secure_url.com',
    };

    uploadStub.resolves(mockResult);

    const result = await uploadImages(fileToUpload);

    expect(uploadStub.calledOnceWith(fileToUpload.path)).to.be.true;
    expect(result).to.deep.equal(mockResult);
  });

  it('should handle errors from the upload process', async () => {
    const fileToUpload = { path: 'path/to/file.jpg' };
    const mockError = new Error('Upload failed');

    uploadStub.rejects(mockError);

    try {
      await uploadImages(fileToUpload);
      expect.fail('Expected error was not thrown');
    } catch (error) {
      expect(error).to.be.an('error');
      expect(error.message).to.equal('Upload failed');
    }
  });

  after(async () => {
    await Users.destroy({
      where: {}
    })
  });

});
})