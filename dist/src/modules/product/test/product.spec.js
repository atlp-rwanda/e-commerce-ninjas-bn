"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const __1 = __importDefault(require("../../.."));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = require("../../../helpers/multer");
const validation_1 = require("../../../middlewares/validation");
const sinon_1 = __importDefault(require("sinon"));
const productRepositories_1 = __importDefault(require("../repositories/productRepositories"));
const http_status_1 = __importDefault(require("http-status"));
const productController = __importStar(require("../controller/productController"));
const userRepositories_1 = __importDefault(require("../../user/repository/userRepositories"));
const userControllers_1 = __importDefault(require("../../user/controller/userControllers"));
const authRepositories_1 = __importDefault(require("../../auth/repository/authRepositories"));
const products_1 = __importDefault(require("../../../databases/models/products"));
const shops_1 = __importDefault(require("../../../databases/models/shops"));
const users_1 = __importDefault(require("../../../databases/models/users"));
const updateExpiredProducts_1 = __importDefault(require("../../../helpers/updateExpiredProducts"));
chai_1.default.use(chai_http_1.default);
const router = () => chai_1.default.request(__1.default);
const imagePath = path_1.default.join(__dirname, "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg");
const imageBuffer = fs_1.default.readFileSync(imagePath);
describe("Product and Shops API Tests", () => {
    let token;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({ email: "dj@gmail.com", password: "Password@123" })
            .end((err, res) => {
            token = res.body.data.token;
            done(err);
        });
    });
    describe("POST /api/shop/seller-create-shop", () => {
        it("should give an error", (done) => {
            router()
                .get("/api/shop/seller-get-products")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(404);
                done();
            });
        });
        it("should create a Shop successfully", (done) => {
            router()
                .post("/api/shop/seller-create-shop")
                .set("Authorization", `Bearer ${token}`)
                .send({
                name: "New Shops",
                description: "A new Shops description",
            })
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(201);
                (0, chai_1.expect)(res.body).to.have.property("message", "Shop created successfully");
                (0, chai_1.expect)(res.body.data.shop).to.include({
                    name: "New Shops",
                    description: "A new Shops description",
                });
                done();
            });
        });
        it("should return a validation error when name is missing", (done) => {
            router()
                .post("/api/shop/seller-create-shop")
                .set("Authorization", `Bearer ${token}`)
                .send({ description: "A new Shops description" })
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(400);
                (0, chai_1.expect)(res.body).to.have.property("status", 400);
                (0, chai_1.expect)(res.body).to.have.property("message", "Name is required");
                done();
            });
        });
        it("should Already have a shop", (done) => {
            router()
                .post("/api/shop/seller-create-shop")
                .set("Authorization", `Bearer ${token}`)
                .send({
                name: "New Shops",
                description: "A new Shops description",
            })
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
                (0, chai_1.expect)(res.body).to.have.property("message", "Already have a shop.");
                (0, chai_1.expect)(res.body).to.have.property("data");
                done();
            });
        });
    });
    describe("POST /api/shop/seller-create-product", () => {
        let productId;
        it("should create a product successfully", (done) => {
            router()
                .post("/api/shop/seller-create-product")
                .set("Authorization", `Bearer ${token}`)
                .field("name", "New Product")
                .field("description", "A new product description")
                .field("price", "99.99")
                .field("category", "Electronics")
                .field("quantity", "10")
                .field("bonus", "10%")
                .field("discount", "10%")
                .field("expiryDate", "2040-4-4")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(http_status_1.default.CREATED);
                (0, chai_1.expect)(res.body).to.have.property("message", "Product created successfully");
                (0, chai_1.expect)(res.body.data.product).to.include({
                    name: "New Product",
                    description: "A new product description",
                });
                productId = res.body.data.product.id;
                done();
            });
        });
        it("should get available products successfully", (done) => {
            router()
                .get("/api/shop/user-get-products")
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
                (0, chai_1.expect)(res.body).to.have.property("status", http_status_1.default.OK);
                done();
            });
        });
        it("should update a product successfully", (done) => {
            router()
                .put(`/api/shop/seller-update-product/${productId}`)
                .set("Authorization", `Bearer ${token}`)
                .field("name", "Updated Product")
                .field("description", "An updated product description")
                .field("price", "88.44")
                .field("category", "Electronics")
                .field("quantity", "15")
                .field("bonus", "15%")
                .field("discount", "11%")
                .field("expiryDate", "2040-11-12")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .attach("images", imageBuffer, "69180880-2138-11eb-8b06-03db3ef1abad.jpeg")
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
                // expect(res.body).to.have.property(
                //   "message",
                //   "Product updated successfully"
                // );
                done();
            });
        });
        it("should update product status to unavailable", (done) => {
            router()
                .put(`/api/shop/seller-update-product-status/${productId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ status: "unavailable" })
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.have.property("message", "Status updated successfully.");
                done();
            });
        });
        it("should get all products", (done) => {
            router()
                .get("/api/shop/seller-get-products")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(200);
                (0, chai_1.expect)(res.body).to.have.property("message", "All products fetched successfully.");
                done();
            });
        });
        it("should return a validation error when images are missing", (done) => {
            router()
                .post("/api/shop/seller-create-product")
                .set("Authorization", `Bearer ${token}`)
                .field("name", "New Product")
                .field("description", "A new product description")
                .field("price", "99.99")
                .field("category", "Electronics")
                .field("quantity", "10")
                .field("bonus", "10%")
                .field("discount", "10%")
                .field("expiryDate", "2040-4-4")
                .end((err, res) => {
                (0, chai_1.expect)(res).to.have.status(400);
                (0, chai_1.expect)(res.body).to.have.property("status", 400);
                (0, chai_1.expect)(res.body).to.have.property("message", "Images must have at least 4 items");
                done();
            });
        });
        it("should  delete items in collection", (done) => {
            router()
                .delete(`/api/shop/seller-delete-product/${productId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((error, response) => {
                (0, chai_1.expect)(response.status).to.be.equal(http_status_1.default.OK);
                (0, chai_1.expect)(response.body).to.have.property("message", "Product deleted successfully");
                done(error);
            });
        });
    });
    describe("Multer Middleware", () => {
        it("should return an error if a non-image file is uploaded", (done) => {
            const req = {};
            const file = {
                originalname: "test.txt",
            };
            const cb = (err) => {
                try {
                    (0, chai_1.expect)(err).to.be.an("error");
                    (0, chai_1.expect)(err.message).to.equal("Only images are allowed");
                    done();
                }
                catch (error) {
                    done(error);
                }
            };
            (0, multer_1.fileFilter)(req, file, cb);
        });
    });
});
describe("transformFilesToBody Middleware", () => {
    it("should return 400 if no files are provided", () => {
        const req = {
            files: null,
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub(),
        };
        const next = sinon_1.default.spy();
        (0, validation_1.transformFilesToBody)(req, res, next);
        (0, chai_1.expect)(res.status.calledWith(400)).to.be.true;
        (0, chai_1.expect)(res.json.calledWith({
            status: 400,
            message: "Images are required",
        })).to.be.true;
    });
});
describe("Seller test cases", () => {
    let token;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({ email: "seller@gmail.com", password: "Password@123" })
            .end((err, res) => {
            token = res.body.data.token;
            done(err);
        });
    });
    it("should return statistics of Seller in specified timeframe", (done) => {
        router()
            .post("/api/shop/seller-statistics")
            .set("Authorization", `Bearer ${token}`)
            .send({
            startDate: "2024-01-01",
            endDate: "2024-12-31",
        })
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.a("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            (0, chai_1.expect)(response.body.message).to.be.a("string");
            done(error);
        });
    });
    it("should catch server error during fetching statistics", (done) => {
        sinon_1.default
            .stub(productRepositories_1.default, "getOrdersPerTimeframe")
            .throws(new Error("Database error"));
        router()
            .post("/api/shop/seller-statistics")
            .set("Authorization", `Bearer ${token}`)
            .send({
            startDate: "2024-01-01",
            endDate: "2024-12-31",
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            done(err);
        });
    });
});
describe("internal server error", () => {
    let token;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({ email: "seller3@gmail.com", password: "Password@123" })
            .end((err, res) => {
            token = res.body.data.token;
            done(err);
        });
    });
    it("should handle errors and return 500 status", (done) => {
        sinon_1.default
            .stub(productRepositories_1.default, "createShop")
            .throws(new Error("Internal Server Error"));
        router()
            .post("/api/shop/seller-create-shop")
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "International Server Error",
            description: "A new Shops description",
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.body).to.have.property("error", "Internal Server Error");
            done(err);
        });
    });
});
describe("Product Middleware", () => {
    describe("isProductExist", () => {
        let req, res, next;
        beforeEach(() => {
            req = {
                user: { id: 1 },
                body: { name: "Product1" },
            };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
            next = sinon_1.default.stub();
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should return 404 if no shop is found", async () => {
            sinon_1.default.stub(productRepositories_1.default, "findShopByAttributes").resolves(null);
            await (0, validation_1.isProductExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.NOT_FOUND,
                message: "Not shop found.",
            });
        });
        it("should return 400 if the product already exists", async () => {
            sinon_1.default
                .stub(productRepositories_1.default, "findShopByAttributes")
                .resolves({ id: 1 });
            sinon_1.default
                .stub(productRepositories_1.default, "findByModelsAndAttributes")
                .resolves(true);
            await (0, validation_1.isProductExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.BAD_REQUEST,
                message: "Please update the quantities.",
            });
        });
        it("should call next if product does not exist", async () => {
            sinon_1.default
                .stub(productRepositories_1.default, "findShopByAttributes")
                .resolves({ id: 1 });
            sinon_1.default
                .stub(productRepositories_1.default, "findByModelsAndAttributes")
                .resolves(false);
            await (0, validation_1.isProductExist)(req, res, next);
            (0, chai_1.expect)(req.shop).to.deep.equal({ id: 1 });
            (0, chai_1.expect)(next).to.have.been.called;
        });
        it("should return 500 on error", async () => {
            sinon_1.default
                .stub(productRepositories_1.default, "findShopByAttributes")
                .throws(new Error("Internal Server Error"));
            await (0, validation_1.isProductExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        });
    });
    describe("isShopExist", () => {
        let req, res, next;
        beforeEach(() => {
            req = { user: { id: 1 } };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
            next = sinon_1.default.stub();
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should call next if no shop is found", async () => {
            sinon_1.default.stub(productRepositories_1.default, "findShopByAttributes").resolves(null);
            await (0, validation_1.isShopExist)(req, res, next);
            (0, chai_1.expect)(next).to.have.been.called;
        });
        it("should return 400 if a shop already exists", async () => {
            sinon_1.default
                .stub(productRepositories_1.default, "findShopByAttributes")
                .resolves({ id: 1 });
            await (0, validation_1.isShopExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.BAD_REQUEST,
                message: "Already have a shop.",
                data: { shop: { id: 1 } },
            });
        });
        it("should return 500 on error", async () => {
            sinon_1.default
                .stub(productRepositories_1.default, "findShopByAttributes")
                .throws(new Error("Internal Server Error"));
            await (0, validation_1.isShopExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        });
    });
});
describe("Product Controller", () => {
    let token;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({ email: "seller3@gmail.com", password: "Password@123" })
            .end((err, res) => {
            token = res.body.data.token;
            done(err);
        });
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    let req, res, next;
    beforeEach(() => {
        req = {};
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        next = sinon_1.default.stub();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 500 if an error occurs in updateProductStatus", async () => {
        const error = new Error("Internal server error");
        sinon_1.default.stub(productRepositories_1.default, "updateProductByAttributes").throws(error);
        req.body = { status: "available" };
        req.params = { id: "123" };
        await productController.updateProductStatus(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
    it("should return 500 if an error occurs in userGetAvailableProducts", async () => {
        const error = new Error("Internal server error");
        sinon_1.default.stub(productRepositories_1.default, "userGetProducts").throws(error);
        await productController.userGetProducts(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
    });
    describe("sellerCreateProduct", () => {
        let req, res;
        beforeEach(() => {
            req = {
                shop: { id: 1 },
                files: [{ filename: "image1.jpg" }, { filename: "image2.jpg" }],
                body: { name: "Product1" },
            };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should handle internal server error", async () => {
            sinon_1.default.stub(req.files, "map").throws(new Error("File upload error"));
            await productController.sellerCreateProduct(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                error: "File upload error",
            });
        });
    });
});
describe("Admin Controller", () => {
    describe("adminGetUsers", () => {
        let req, res;
        beforeEach(() => {
            req = {};
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should handle internal server error", async () => {
            sinon_1.default
                .stub(userRepositories_1.default, "getAllUsers")
                .throws(new Error("Internal Server Error"));
            await userControllers_1.default.adminGetUsers(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        });
    });
    describe("adminGetUser", () => {
        let req, res;
        beforeEach(() => {
            req = { params: { id: 1 } };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should handle internal server error", async () => {
            sinon_1.default
                .stub(authRepositories_1.default, "findUserByAttributes")
                .throws(new Error("Internal Server Error"));
            await userControllers_1.default.adminGetUser(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        });
    });
    describe("getUserDetails", () => {
        let req, res;
        beforeEach(() => {
            req = { user: { id: 1 } };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should handle internal server error", async () => {
            sinon_1.default
                .stub(authRepositories_1.default, "findUserByAttributes")
                .throws(new Error("Internal Server Error"));
            await userControllers_1.default.getUserDetails(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            });
        });
    });
    describe("updateUserProfile", () => {
        let req, res;
        beforeEach(() => {
            req = {
                user: { id: 1 },
                file: {
                    path: "../test/69180880-2138-11eb-8b06-03db3ef1abad.jpeg",
                    filename: "69180880-2138-11eb-8b06-03db3ef1abad.jpeg",
                },
                body: { name: "John Doe" },
            };
            res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub().returnsThis(),
            };
        });
        afterEach(() => {
            sinon_1.default.restore();
        });
        it("should handle internal server error", async () => {
            sinon_1.default
                .stub(userRepositories_1.default, "updateUserProfile")
                .throws(new Error("Internal Server Error"));
            await userControllers_1.default.updateUserProfile(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        });
        it("should handle missing required parameter - file", async () => {
            delete req.file;
            await userControllers_1.default.updateUserProfile(req, res);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        });
    });
});
describe("Change Password Test Cases", () => {
    let token = null;
    before((done) => {
        router()
            .post("/api/auth/login")
            .send({
            email: "admin@gmail.com",
            password: "Newpassword#12",
        })
            .end((error, response) => {
            token = response.body.data.token;
            done(error);
        });
    });
    it("should change the password when the user changes the password", (done) => {
        router()
            .put("/api/user/change-password")
            .set("authorization", `Bearer ${token}`)
            .send({
            oldPassword: "Newpassword#12",
            newPassword: "NewPassword!123",
            confirmPassword: "NewPassword!123",
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.OK);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Password updated successfully");
            done(err);
        });
    });
    it("should return an error if the password is invalid", (done) => {
        router()
            .put("/api/user/change-password")
            .set("authorization", `Bearer ${token}`)
            .send({
            oldPassword: "Newpassword#12",
            newPassword: "NewPassword!123",
            confirmPassword: "NewPassword!123",
        })
            .end((err, res) => {
            (0, chai_1.expect)(res).to.have.status(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(res.body).to.be.an("object");
            (0, chai_1.expect)(res.body).to.have.property("message", "Invalid password.");
            done(err);
        });
    });
});
describe("isPaginated middleware", () => {
    let req;
    let res;
    let nextCalled;
    beforeEach(() => {
        req = {
            query: {},
            pagination: {
                limit: undefined,
                page: undefined,
                offset: undefined,
            },
        };
        res = {};
        nextCalled = false;
    });
    const next = () => {
        nextCalled = true;
    };
    it("should set limit and page parameters if provided in the request query", () => {
        req.query.limit = "10";
        req.query.page = "1";
        (0, validation_1.isPaginated)(req, res, next);
        (0, chai_1.expect)(req.pagination).to.deep.equal({
            limit: 10,
            page: 1,
            offset: 0,
        });
        (0, chai_1.expect)(nextCalled).to.be.true;
    });
    it("should set limit and page as undefined if not provided in the request query", () => {
        (0, validation_1.isPaginated)(req, res, next);
        (0, chai_1.expect)(req.pagination).to.deep.equal({
            limit: undefined,
            page: undefined,
            offset: undefined,
        });
        (0, chai_1.expect)(nextCalled).to.be.true;
    });
    it("should calculate offset if both limit and page are provided in the request query", () => {
        req.query.limit = "10";
        req.query.page = "2";
        (0, validation_1.isPaginated)(req, res, next);
        (0, chai_1.expect)(req.pagination).to.deep.equal({
            limit: 10,
            page: 2,
            offset: 10,
        });
        (0, chai_1.expect)(nextCalled).to.be.true;
    });
});
describe("User filter products", () => {
    it("Should reject if one of Min and Max Price Provided without other", (done) => {
        router()
            .get("/api/shop/user-search-products?minprice=1")
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("message");
            done(error);
        });
    });
    it("Should reject if min price is greater than max price", (done) => {
        router()
            .get("/api/shop/user-search-products?minprice=10&maxprice=1")
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.BAD_REQUEST);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("message");
            done(error);
        });
    });
    it("Should return data if data are provided", (done) => {
        router()
            .get("/api/shop/user-search-products?minprice=10&maxprice=100&category=Cosmetics&name=l")
            .end((error, response) => {
            (0, chai_1.expect)(response.status).to.equal(http_status_1.default.OK);
            (0, chai_1.expect)(response.body).to.be.an("object");
            (0, chai_1.expect)(response.body).to.have.property("data");
            done(error);
        });
    });
});
describe("sellerViewSpecificProduct", () => {
    let req;
    let res;
    let findProductStub;
    beforeEach(() => {
        req = {
            params: { id: "test-product-id" },
            shop: { id: "test-shop-id" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        findProductStub = sinon_1.default.stub(productRepositories_1.default, "sellerGetProductById");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should fetch product successfully", async () => {
        const productData = { id: "test-product-id", name: "Test Product" };
        findProductStub.resolves(productData);
        await productController.sellerGetProduct(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Product fetched successfully.",
            data: productData,
        });
    });
    it("should handle errors", async () => {
        const error = new Error("Something went wrong");
        findProductStub.rejects(error);
        await productController.sellerGetProduct(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
});
describe("userGetProduct", () => {
    let req;
    let res;
    let sandbox;
    beforeEach(() => {
        sandbox = sinon_1.default.createSandbox();
        req = {
            params: { id: "product-id" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should return product details when product is found", async () => {
        const mockProduct = {
            id: "product-id",
            name: "Product Name",
            price: 100,
            description: "Product Description",
        };
        sandbox.stub(productRepositories_1.default, "findProductById").resolves(mockProduct);
        await productController.userGetProduct(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Products is fetched successfully.",
            product: mockProduct,
        });
    });
    it("should handle errors properly", async () => {
        const error = new Error("Something went wrong");
        sandbox.stub(productRepositories_1.default, "findProductById").throws(error);
        await productController.userGetProduct(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: error.message,
        });
    });
});
describe("buyerAddProductToWishList", () => {
    let mockReq;
    let mockRes;
    let addProductToWishListStub;
    beforeEach(() => {
        mockReq = {
            params: { id: "validProductId" },
            user: { id: "validUserId" },
        };
        mockRes = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub(),
        };
        addProductToWishListStub = sinon_1.default.stub(productRepositories_1.default, "addProductToWishList");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should add product to wishlist successfully", async () => {
        const mockProduct = {
            productId: "validProductId",
            userId: "validUserId",
        };
        addProductToWishListStub.resolves(mockProduct);
        await productController.buyerAddProductToWishList(mockReq, mockRes);
        (0, chai_1.expect)(mockRes.status).to.have.been.calledWith(http_status_1.default.OK);
    });
    it("should handle internal server error", async () => {
        const errorMessage = "Database error";
        addProductToWishListStub.rejects(new Error(errorMessage));
        await productController.buyerAddProductToWishList(mockReq, mockRes);
        (0, chai_1.expect)(mockRes.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(mockRes.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: errorMessage,
        });
    });
});
describe("isProductExistToWishlist Middleware", () => {
    let req;
    let res;
    let next;
    let findProductfromWishListStub;
    beforeEach(() => {
        req = {
            params: { id: "productId" },
            user: { id: "userId" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        next = sinon_1.default.stub();
        findProductfromWishListStub = sinon_1.default.stub(productRepositories_1.default, "findProductfromWishList");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should return 200 and product data if product exists in wishlist", async () => {
        const product = { id: "productId", name: "Product Name" };
        findProductfromWishListStub.resolves(product);
        await (0, validation_1.isProductExistToWishlist)(req, res, next);
        (0, chai_1.expect)(findProductfromWishListStub).to.have.been.calledWith("productId", "userId");
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            message: "Product is added to wishlist successfully.",
            data: { product },
        });
        (0, chai_1.expect)(next).not.to.have.been.called;
    });
    it("should call next if product does not exist in wishlist", async () => {
        findProductfromWishListStub.resolves(null);
        await (0, validation_1.isProductExistToWishlist)(req, res, next);
        (0, chai_1.expect)(findProductfromWishListStub).to.have.been.calledWith("productId", "userId");
        (0, chai_1.expect)(next).to.have.been.called;
        (0, chai_1.expect)(res.status).not.to.have.been.called;
        (0, chai_1.expect)(res.json).not.to.have.been.called;
    });
    it("should return 500 if an error occurs", async () => {
        const errorMessage = "Internal Server Error";
        findProductfromWishListStub.rejects(new Error(errorMessage));
        await (0, validation_1.isProductExistToWishlist)(req, res, next);
        (0, chai_1.expect)(findProductfromWishListStub).to.have.been.calledWith("productId", "userId");
        (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: errorMessage,
        });
        (0, chai_1.expect)(next).not.to.have.been.called;
    });
});
describe("Wishlist Middlewares", () => {
    let req;
    let res;
    let next;
    let findProductFromWishListByUserIdStub;
    let findProductfromWishListStub;
    beforeEach(() => {
        req = {
            user: { id: "userId" },
            params: { id: "productId" },
        };
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        next = sinon_1.default.stub();
        findProductFromWishListByUserIdStub = sinon_1.default.stub(productRepositories_1.default, "findProductFromWishListByUserId");
        findProductfromWishListStub = sinon_1.default.stub(productRepositories_1.default, "findProductfromWishList");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    describe("isUserWishlistExist Middleware", () => {
        it("should return 404 if no wishlist is found", async () => {
            findProductFromWishListByUserIdStub.resolves(null);
            await (0, validation_1.isUserWishlistExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "No wishlist Found",
            });
            (0, chai_1.expect)(next).not.to.have.been.called;
        });
        it("should return 404 if wishlist is an empty array", async () => {
            findProductFromWishListByUserIdStub.resolves([]);
            await (0, validation_1.isUserWishlistExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "No wishlist Found",
            });
            (0, chai_1.expect)(next).not.to.have.been.called;
        });
        it("should call next if wishlist is found", async () => {
            const wishList = [{ id: "item1" }];
            findProductFromWishListByUserIdStub.resolves(wishList);
            await (0, validation_1.isUserWishlistExist)(req, res, next);
            (0, chai_1.expect)(next).to.have.been.called;
            (0, chai_1.expect)(res.status).not.to.have.been.called;
            (0, chai_1.expect)(res.json).not.to.have.been.called;
        });
        it("should return 500 if an error occurs", async () => {
            const errorMessage = "Internal server error";
            findProductFromWishListByUserIdStub.rejects(new Error(errorMessage));
            await (0, validation_1.isUserWishlistExist)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: errorMessage,
            });
            (0, chai_1.expect)(next).not.to.have.been.called;
        });
    });
    describe("isUserWishlistExistById Middleware", () => {
        it("should return 404 if product is not found in wishlist", async () => {
            findProductfromWishListStub.resolves(null);
            await (0, validation_1.isUserWishlistExistById)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.NOT_FOUND);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                message: "Product Not Found From WishList",
            });
            (0, chai_1.expect)(next).not.to.have.been.called;
        });
        it("should call next if product is found in wishlist", async () => {
            const product = { id: "productId" };
            findProductfromWishListStub.resolves(product);
            await (0, validation_1.isUserWishlistExistById)(req, res, next);
            (0, chai_1.expect)(next).to.have.been.called;
            (0, chai_1.expect)(res.status).not.to.have.been.called;
            (0, chai_1.expect)(res.json).not.to.have.been.called;
        });
        it("should return 500 if an error occurs", async () => {
            const errorMessage = "Internal server error";
            findProductfromWishListStub.rejects(new Error(errorMessage));
            await (0, validation_1.isUserWishlistExistById)(req, res, next);
            (0, chai_1.expect)(res.status).to.have.been.calledWith(http_status_1.default.INTERNAL_SERVER_ERROR);
            (0, chai_1.expect)(res.json).to.have.been.calledWith({
                status: http_status_1.default.INTERNAL_SERVER_ERROR,
                message: errorMessage,
            });
            (0, chai_1.expect)(next).not.to.have.been.called;
        });
    });
});
describe("Wishlist Routes", () => {
    let deleteAllWishListByUserIdStub;
    let deleteProductFromWishListByIdStub;
    beforeEach(() => {
        deleteAllWishListByUserIdStub = sinon_1.default.stub(productRepositories_1.default, "deleteAllWishListByUserId");
        deleteProductFromWishListByIdStub = sinon_1.default.stub(productRepositories_1.default, "deleteProductFromWishListById");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    describe("buyerDeleteAllProductFromWishlist", () => {
        it("should clear all products from wishlist", async () => {
            deleteAllWishListByUserIdStub.resolves();
            const req = { user: { id: "user-id" } };
            const res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            await productController.buyerDeleteAllProductFromWishlist(req, res);
            (0, chai_1.expect)(res.status.calledWith(200)).to.be.true;
            (0, chai_1.expect)(res.json.calledWith({
                message: "Your wishlist is cleared successfully.",
            })).to.be.true;
        });
        it("should return 500 if an error occurs", async () => {
            const errorMessage = "Internal server error";
            deleteAllWishListByUserIdStub.rejects(new Error(errorMessage));
            const req = { user: { id: "user-id" } };
            const res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            await productController.buyerDeleteAllProductFromWishlist(req, res);
            (0, chai_1.expect)(res.status.calledWith(500)).to.be.true;
            (0, chai_1.expect)(res.json.calledWith({
                message: "Internal server error",
                error: errorMessage,
            })).to.be.true;
        });
    });
    describe("buyerDeleteProductFromWishList", () => {
        it("should remove a product from wishlist", async () => {
            deleteProductFromWishListByIdStub.resolves();
            const req = {
                params: { id: "product-id" },
                user: { id: "user-id" },
            };
            const res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            await productController.buyerDeleteProductFromWishList(req, res);
            (0, chai_1.expect)(res.status.calledWith(200)).to.be.true;
            (0, chai_1.expect)(res.json.calledWith({
                message: "The product  removed from wishlist successfully.",
            })).to.be.true;
        });
        it("should return 500 if an error occurs", async () => {
            const errorMessage = "Internal server error";
            deleteProductFromWishListByIdStub.rejects(new Error(errorMessage));
            const req = {
                params: { id: "product-id" },
                user: { id: "user-id" },
            };
            const res = {
                status: sinon_1.default.stub().returnsThis(),
                json: sinon_1.default.stub(),
            };
            await productController.buyerDeleteProductFromWishList(req, res);
            (0, chai_1.expect)(res.status.calledWith(500)).to.be.true;
            (0, chai_1.expect)(res.json.calledWith({
                message: "Internal server error",
                error: errorMessage,
            })).to.be.true;
        });
    });
});
describe("updateExpiredProducts", () => {
    let req;
    let res;
    let productFindAllStub;
    let productUpdateStub;
    let shopFindAllStub;
    let userFindAllStub;
    beforeEach(() => {
        req = {};
        res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        productFindAllStub = sinon_1.default.stub(products_1.default, "findAll");
        productUpdateStub = sinon_1.default.stub();
        shopFindAllStub = sinon_1.default.stub(shops_1.default, "findAll");
        userFindAllStub = sinon_1.default.stub(users_1.default, "findAll");
        products_1.default.prototype.update = productUpdateStub;
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should update expired products and send emails to the respective users", async () => {
        const expiredProducts = [
            {
                id: "productId1",
                shopId: "shopId1",
                name: "Product1",
                update: productUpdateStub,
            },
            {
                id: "productId2",
                shopId: "shopId2",
                name: "Product2",
                update: productUpdateStub,
            },
        ];
        const shops = [
            { id: "shopId1", userId: "userId1" },
            { id: "shopId2", userId: "userId2" },
        ];
        const users = [
            { id: "userId1", email: "user1@example.com", firstName: "User1" },
            { id: "userId2", email: "user2@example.com", firstName: "User2" },
        ];
        productFindAllStub.onFirstCall().resolves(expiredProducts);
        shopFindAllStub.resolves(shops);
        userFindAllStub.resolves(users);
        await (0, updateExpiredProducts_1.default)();
        (0, chai_1.expect)(productFindAllStub).to.have.been.calledOnce;
        (0, chai_1.expect)(productUpdateStub).to.have.been.calledTwice;
        (0, chai_1.expect)(shopFindAllStub).to.have.been.calledOnce;
        (0, chai_1.expect)(userFindAllStub).to.have.been.calledOnce;
        (0, chai_1.expect)(res.status).not.to.have.been.called;
        (0, chai_1.expect)(res.json).not.to.have.been.called;
    });
    it("should return 500 if an error occurs", async () => {
        productFindAllStub.rejects(new Error("Internal Server Error"));
        await (0, updateExpiredProducts_1.default)();
        (0, chai_1.expect)(productFindAllStub).to.have.been.calledOnce;
    });
});
describe("buyerViewWishLists", () => {
    let findProductFromWishListByUserIdStub;
    beforeEach(() => {
        findProductFromWishListByUserIdStub = sinon_1.default.stub(productRepositories_1.default, "findProductFromWishListByUserId");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should fetch wishlist successfully", async () => {
        const mockProducts = [{ id: 1, name: "Product 1", price: 100 }];
        findProductFromWishListByUserIdStub.resolves(mockProducts);
        const req = {
            user: { id: 1 },
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        await productController.buyerViewWishLists(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledOnceWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledOnceWith({
            message: "WishList is fetched successfully.",
            data: { product: mockProducts },
        });
        (0, chai_1.expect)(findProductFromWishListByUserIdStub).to.have.been.calledOnceWith(1);
    });
    it("should handle errors in fetching wishlist", async () => {
        const errorMessage = "Something went wrong";
        findProductFromWishListByUserIdStub.rejects(new Error(errorMessage));
        const req = {
            user: { id: 1 },
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        await productController.buyerViewWishLists(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledOnceWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledOnceWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: errorMessage,
        });
    });
});
describe("buyerViewWishList", () => {
    let findProductfromWishListStub;
    beforeEach(() => {
        findProductfromWishListStub = sinon_1.default.stub(productRepositories_1.default, "findProductfromWishList");
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("should fetch wishlist successfully", async () => {
        const mockProducts = [{ id: 1, name: "Product 1", price: 100 }];
        findProductfromWishListStub.resolves(mockProducts);
        const req = {
            params: { id: "1" },
            user: { id: 1 },
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        await productController.buyerViewWishList(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledOnceWith(http_status_1.default.OK);
        (0, chai_1.expect)(res.json).to.have.been.calledOnceWith({
            message: "WishList is fetched successfully.",
            data: { product: mockProducts },
        });
        (0, chai_1.expect)(findProductfromWishListStub).to.have.been.calledOnceWith("1", 1);
    });
    it("should handle errors in fetching wishlist", async () => {
        const errorMessage = "Something went wrong";
        findProductfromWishListStub.rejects(new Error(errorMessage));
        const req = {
            params: { id: "1" },
            user: { id: 1 },
        };
        const res = {
            status: sinon_1.default.stub().returnsThis(),
            json: sinon_1.default.stub().returnsThis(),
        };
        await productController.buyerViewWishList(req, res);
        (0, chai_1.expect)(res.status).to.have.been.calledOnceWith(http_status_1.default.INTERNAL_SERVER_ERROR);
        (0, chai_1.expect)(res.json).to.have.been.calledOnceWith({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            error: errorMessage,
        });
    });
});
//# sourceMappingURL=product.spec.js.map