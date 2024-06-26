"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserWishlistExistById = exports.isUserWishlistExist = exports.isProductExistToWishlist = exports.isProductExistById = exports.isCartProductExist = exports.isCartExist = exports.isProductIdExist = exports.isCartIdExist = exports.isSearchFiltered = exports.isPaginated = exports.verifyOtp = exports.isSellerShopExist = exports.isUserVerified = exports.isUserEnabled = exports.isGoogleEnabled = exports.verifyUser = exports.isSessionExist = exports.credential = exports.transformFilesToBody = exports.isShopExist = exports.isProductExist = exports.isUsersExist = exports.verifyUserCredentials = exports.isAccountVerified = exports.isUserExist = exports.validation = void 0;
const authRepositories_1 = __importDefault(require("../modules/auth/repository/authRepositories"));
const users_1 = __importDefault(require("../databases/models/users"));
const http_status_1 = __importDefault(require("http-status"));
const helpers_1 = require("../helpers");
const productRepositories_1 = __importDefault(require("../modules/product/repositories/productRepositories"));
const shops_1 = __importDefault(require("../databases/models/shops"));
const products_1 = __importDefault(require("../databases/models/products"));
const sendEmail_1 = require("../services/sendEmail");
const sequelize_1 = require("sequelize");
const currentDate = new Date();
const cartRepositories_1 = __importDefault(require("../modules/cart/repositories/cartRepositories"));
const models_1 = __importDefault(require("../databases/models"));
const validation = (schema) => async (req, res, next) => {
    try {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            throw new Error(error.details
                .map((detail) => detail.message.replace(/"/g, ""))
                .join(", "));
        }
        return next();
    }
    catch (error) {
        res
            .status(http_status_1.default.BAD_REQUEST)
            .json({ status: http_status_1.default.BAD_REQUEST, message: error.message });
    }
};
exports.validation = validation;
const isUserExist = async (req, res, next) => {
    try {
        let userExists = null;
        if (req.body.email) {
            userExists = await authRepositories_1.default.findUserByAttributes("email", req.body.email);
            if (userExists) {
                if (userExists.isVerified) {
                    return res.status(http_status_1.default.BAD_REQUEST).json({
                        status: http_status_1.default.BAD_REQUEST,
                        message: "Account already exists.",
                    });
                }
                return res.status(http_status_1.default.BAD_REQUEST).json({
                    status: http_status_1.default.BAD_REQUEST,
                    message: "Account already exists. Please verify your account",
                });
            }
        }
        if (req.params.id) {
            userExists = await authRepositories_1.default.findUserByAttributes("id", req.params.id);
            if (userExists) {
                return next();
            }
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ status: http_status_1.default.NOT_FOUND, message: "User not found" });
        }
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isUserExist = isUserExist;
const isUsersExist = async (req, res, next) => {
    try {
        const userCount = await users_1.default.count();
        if (userCount === 0) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ error: "No users found in the database." });
        }
        next();
    }
    catch (err) {
        res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: "Internet Server error." });
    }
};
exports.isUsersExist = isUsersExist;
const isAccountVerified = async (req, res, next) => {
    try {
        let user = null;
        if (req?.params?.token) {
            const decodedToken = await (0, helpers_1.decodeToken)(req.params.token);
            user = await authRepositories_1.default.findUserByAttributes("id", decodedToken.id);
        }
        if (req?.body?.email) {
            user = await authRepositories_1.default.findUserByAttributes("email", req.body.email);
        }
        if (!user) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ message: "Account not found." });
        }
        if (user.isVerified) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ message: "Account already verified." });
        }
        const session = await authRepositories_1.default.findSessionByAttributes("userId", user.id);
        if (!session) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ message: "Invalid token." });
        }
        req.session = session;
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isAccountVerified = isAccountVerified;
const verifyUserCredentials = async (req, res, next) => {
    try {
        const user = await authRepositories_1.default.findUserByAttributes("email", req.body.email);
        if (!user) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ message: "Invalid Email or Password" });
        }
        if (user.is2FAEnabled) {
            const { otp, expirationTime } = (0, helpers_1.generateOTP)();
            const device = req.headers["user-device"] || null;
            const session = {
                userId: user.id,
                device,
                otp: otp,
                otpExpiration: expirationTime,
            };
            await authRepositories_1.default.createSession(session);
            await (0, sendEmail_1.sendEmail)(user.email, "E-Commerce Ninja Login", `Dear ${user.lastName || user.email}\n\nUse This Code To Confirm Your Account: ${otp}`);
            const isTokenExist = await authRepositories_1.default.findTokenByDeviceIdAndUserId(device, user.id);
            if (isTokenExist) {
                return res.status(http_status_1.default.OK).json({
                    message: "Check your Email for OTP Confirmation",
                    UserId: { userId: user.id },
                    data: { token: isTokenExist },
                });
            }
            return res.status(http_status_1.default.OK).json({
                message: "Check your Email for OTP Confirmation",
                UserId: { userId: user.id },
            });
        }
        const passwordMatches = await (0, helpers_1.comparePassword)(req.body.password, user.password);
        if (!passwordMatches) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ message: "Invalid Email or Password" });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res
            .status(http_status_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server error", data: error.message });
    }
};
exports.verifyUserCredentials = verifyUserCredentials;
const verifyUser = async (req, res, next) => {
    try {
        let user = null;
        if (req?.params?.token) {
            const decodedToken = await (0, helpers_1.decodeToken)(req.params.token);
            user = await authRepositories_1.default.findUserByAttributes("id", decodedToken.id);
        }
        if (req?.body?.email) {
            user = await authRepositories_1.default.findUserByAttributes("email", req.body.email);
        }
        if (!user) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ status: http_status_1.default.NOT_FOUND, message: "Account not found." });
        }
        if (!user.isVerified) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                status: http_status_1.default.BAD_REQUEST,
                message: "Account is not verified.",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.verifyUser = verifyUser;
const isSessionExist = async (req, res, next) => {
    try {
        const session = await authRepositories_1.default.findSessionByAttributes("userId", req.user.id);
        if (!session) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ status: http_status_1.default.BAD_REQUEST, message: "Invalid token." });
        }
        const destroy = await authRepositories_1.default.destroySessionByAttribute("userId", req.user.id, "token", session.token);
        if (destroy) {
            const hashedPassword = await (0, helpers_1.hashPassword)(req.body.newPassword);
            req.user.password = hashedPassword;
            next();
        }
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isSessionExist = isSessionExist;
const isProductExist = async (req, res, next) => {
    try {
        const shop = await productRepositories_1.default.findShopByAttributes(shops_1.default, "userId", req.user.id);
        if (!shop) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ status: http_status_1.default.NOT_FOUND, message: "Not shop found." });
        }
        const isProductAvailable = await productRepositories_1.default.findByModelsAndAttributes(products_1.default, "name", "shopId", req.body.name, shop.id);
        if (isProductAvailable) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                status: http_status_1.default.BAD_REQUEST,
                message: "Please update the quantities.",
            });
        }
        req.shop = shop;
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isProductExist = isProductExist;
const credential = async (req, res, next) => {
    try {
        let user = null;
        if (req.user.id) {
            user = await authRepositories_1.default.findUserByAttributes("id", req.user.id);
        }
        const compareUserPassword = await (0, helpers_1.comparePassword)(req.body.oldPassword, user.password);
        if (!compareUserPassword) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ status: http_status_1.default.BAD_REQUEST, message: "Invalid password." });
        }
        const hashedPassword = await (0, helpers_1.hashPassword)(req.body.newPassword);
        user.password = hashedPassword;
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.credential = credential;
const isShopExist = async (req, res, next) => {
    try {
        const shop = await productRepositories_1.default.findShopByAttributes(models_1.default.Shops, "userId", req.user.id);
        if (shop) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                status: http_status_1.default.BAD_REQUEST,
                message: "Already have a shop.",
                data: { shop: shop },
            });
        }
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isShopExist = isShopExist;
const isSellerShopExist = async (req, res, next) => {
    try {
        const shop = await productRepositories_1.default.findShopByAttributes(shops_1.default, "userId", req.user.id);
        if (!shop) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ status: http_status_1.default.NOT_FOUND, message: "Shop not found" });
        }
        req.shop = shop;
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isSellerShopExist = isSellerShopExist;
const transformFilesToBody = (req, res, next) => {
    if (!req.files) {
        return res
            .status(400)
            .json({ status: 400, message: "Images are required" });
    }
    const files = req.files;
    req.body.images = files.map((file) => file.path);
    next();
};
exports.transformFilesToBody = transformFilesToBody;
const verifyOtp = async (req, res, next) => {
    try {
        const user = await authRepositories_1.default.findUserByAttributes("id", req.params.id);
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                status: http_status_1.default.NOT_FOUND,
                message: "User not found.",
            });
        }
        const sessionData = await authRepositories_1.default.findSessionByUserIdOtp(user.id, req.body.otp);
        if (!sessionData || !sessionData.otp) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                status: http_status_1.default.BAD_REQUEST,
                message: "Invalid or expired code.",
            });
        }
        if (new Date() > sessionData.otpExpiration) {
            await authRepositories_1.default.destroySessionByAttribute("userId", user.id, "otp", req.body.otp);
            return res.status(http_status_1.default.BAD_REQUEST).json({
                status: http_status_1.default.BAD_REQUEST,
                message: "OTP expired.",
            });
        }
        await authRepositories_1.default.destroySessionByAttribute("userId", user.id, "otp", req.body.otp);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.verifyOtp = verifyOtp;
const isUserVerified = async (req, res, next) => {
    const user = await authRepositories_1.default.findUserByAttributes("email", req.body.email);
    if (!user)
        return res
            .status(http_status_1.default.BAD_REQUEST)
            .json({ message: "Invalid Email or Password" });
    if (user.isVerified === false)
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            status: http_status_1.default.UNAUTHORIZED,
            message: "Your account is not verified yet",
        });
    req.user = user;
    return next();
};
exports.isUserVerified = isUserVerified;
const isUserEnabled = async (req, res, next) => {
    if (req.user.status !== "enabled")
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            status: http_status_1.default.UNAUTHORIZED,
            message: "Your account is disabled",
        });
    return next();
};
exports.isUserEnabled = isUserEnabled;
const isGoogleEnabled = async (req, res, next) => {
    if (req.user.isGoogleAccount)
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            status: http_status_1.default.UNAUTHORIZED,
            message: "This is google account, please login with google",
        });
    return next();
};
exports.isGoogleEnabled = isGoogleEnabled;
const isCartExist = async (req, res, next) => {
    try {
        const cart = await cartRepositories_1.default.getCartsByUserId(req.user.id);
        if (!cart) {
            return res.status(http_status_1.default.NOT_FOUND).json({ status: http_status_1.default.NOT_FOUND, message: "No cart found. Please create a cart first." });
        }
        req.cart = cart;
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isCartExist = isCartExist;
const isProductIdExist = async (req, res, next) => {
    try {
        const product = await productRepositories_1.default.findProductById(req.body.productId);
        if (!product)
            return res.status(http_status_1.default.NOT_FOUND).json({
                status: http_status_1.default.NOT_FOUND,
                message: "No product with that ID.",
            });
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isProductIdExist = isProductIdExist;
const isCartIdExist = async (req, res, next) => {
    const cart = await cartRepositories_1.default.getCartByUserIdAndCartId(req.user.id, req.params.cartId);
    if (!cart)
        return res.status(http_status_1.default.NOT_FOUND).json({ status: http_status_1.default.NOT_FOUND, message: "Cart not found. Please add items to your cart." });
    req.cart = cart;
    return next();
};
exports.isCartIdExist = isCartIdExist;
const isCartProductExist = async (req, res, next) => {
    try {
        const product = await cartRepositories_1.default.getProductByCartIdAndProductId(req.cart.id, req.params.productId);
        if (!product)
            return res.status(http_status_1.default.NOT_FOUND).json({
                status: http_status_1.default.NOT_FOUND,
                message: "Product not found.",
            });
        req.product = product;
        return next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isCartProductExist = isCartProductExist;
const isPaginated = (req, res, next) => {
    const limit = req.query.limit
        ? Number(req.query.limit)
        : undefined;
    const page = req.query.page
        ? Number(req.query.page)
        : undefined;
    req.pagination = {
        limit,
        page,
        offset: limit && page ? (page - 1) * limit : undefined,
    };
    next();
};
exports.isPaginated = isPaginated;
const isSearchFiltered = (req, res, next) => {
    const name = req.query.name || undefined;
    const category = req.query.category || undefined;
    const description = req.query.description || undefined;
    const minPrice = req.query.minprice || undefined;
    const maxPrice = req.query.maxprice || undefined;
    const searchQuery = { where: {} };
    if ((minPrice && !maxPrice) || (!minPrice && maxPrice)) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            status: http_status_1.default.BAD_REQUEST,
            message: "Minimum and maximum price are required",
        });
    }
    if (Number(minPrice) > Number(maxPrice)) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            status: http_status_1.default.BAD_REQUEST,
            message: "Minimum Price must be less than Maximum price",
        });
    }
    const orConditions = [];
    if (name !== undefined)
        orConditions.push({ name: { [sequelize_1.Op.iLike]: `%${name}%` } });
    if (category !== undefined)
        orConditions.push({ category });
    if (description !== undefined)
        orConditions.push({ description: { [sequelize_1.Op.iLike]: `%${description}%` } });
    if (minPrice !== undefined && maxPrice !== undefined) {
        orConditions.push({
            price: {
                [sequelize_1.Op.gte]: minPrice,
                [sequelize_1.Op.lte]: maxPrice,
            },
        });
    }
    if (orConditions.length > 0) {
        searchQuery.where[sequelize_1.Op.or] = orConditions;
    }
    searchQuery.where.status = "available";
    searchQuery.where.expiryDate = {
        [sequelize_1.Op.gte]: currentDate,
    };
    req.searchQuery = searchQuery;
    return next();
};
exports.isSearchFiltered = isSearchFiltered;
const isProductExistById = async (req, res, next) => {
    try {
        const product = await productRepositories_1.default.findProductById(req.params.id);
        if (!product) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ status: http_status_1.default.NOT_FOUND, message: "No product found." });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isProductExistById = isProductExistById;
const isProductExistToWishlist = async (req, res, next) => {
    try {
        const product = await productRepositories_1.default.findProductfromWishList(req.params.id, req.user.id);
        if (product) {
            return res.status(http_status_1.default.OK).json({
                message: "Product is added to wishlist successfully.",
                data: { product },
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isProductExistToWishlist = isProductExistToWishlist;
const isUserWishlistExist = async (req, res, next) => {
    try {
        const wishList = await productRepositories_1.default.findProductFromWishListByUserId(req.user.id);
        if (!wishList || wishList.length === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                message: "No wishlist Found",
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isUserWishlistExist = isUserWishlistExist;
const isUserWishlistExistById = async (req, res, next) => {
    try {
        const product = await productRepositories_1.default.findProductfromWishList(req.params.id, req.user.id);
        if (!product) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                message: "Product Not Found From WishList",
            });
        }
        next();
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            status: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
exports.isUserWishlistExistById = isUserWishlistExistById;
//# sourceMappingURL=validation.js.map