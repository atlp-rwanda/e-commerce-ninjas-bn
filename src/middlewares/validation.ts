/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import Users, { usersAttributes } from "../databases/models/users";
import httpStatus from "http-status";
import {
  comparePassword,
  decodeToken,
  generateOTP,
  generateRandomCode,
  hashPassword,
} from "../helpers";
import productRepositories from "../modules/product/repositories/productRepositories";
import Shops from "../databases/models/shops";
import Products from "../databases/models/products";
import { ExtendRequest } from "../types";
import { sendEmail } from "../services/sendEmail";
import { Op } from "sequelize";

const currentDate = new Date();

import cartRepositories from "../modules/cart/repositories/cartRepositories";
import db from "../databases/models";

const validation =
  (schema: Joi.ObjectSchema | Joi.ArraySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        throw new Error(
          error.details
            .map((detail) => detail.message.replace(/"/g, ""))
            .join(", ")
        );
      }
      return next();
    } catch (error) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: httpStatus.BAD_REQUEST, message: error.message });
    }
  };

const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userExists: usersAttributes | null = null;

    if (req.body.email) {
      userExists = await authRepositories.findUserByAttributes(
        "email",
        req.body.email
      );
      if (userExists) {
        if (userExists.isVerified) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Account already exists.",
          });
        }
        return res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message: "Account already exists. Please verify your account",
        });
      }
    }

    if (req.params.id) {
      userExists = await authRepositories.findUserByAttributes(
        "id",
        req.params.id
      );
      if (userExists) {
        return next();
      }
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ status: httpStatus.NOT_FOUND, message: "User not found" });
    }

    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isUsersExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userCount = await Users.count();
    if (userCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "No users found in the database." });
    }
    next();
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internet Server error." });
  }
};

const isAccountVerified = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: any = null;
    if (req?.params?.token) {
      const decodedToken = await decodeToken(req.params.token);
      user = await authRepositories.findUserByAttributes("id", decodedToken.id);
    }
    if (req?.body?.email) {
      user = await authRepositories.findUserByAttributes(
        "email",
        req.body.email
      );
    }

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Account not found." });
    }

    if (user.isVerified) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Account already verified." });
    }

    const session = await authRepositories.findSessionByAttributes(
      "userId",
      user.id
    );
    if (!session) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid token." });
    }

    req.session = session;
    req.user = user;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const verifyUserCredentials = async (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authRepositories.findUserByAttributes(
      "email",
      req.body.email
    );
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }
    if (user.is2FAEnabled) {
      const { otp, expirationTime } = generateOTP();
      const device: any = req.headers["user-device"] || null;

      const session = {
        userId: user.id,
        device,
        otp: otp,
        otpExpiration: expirationTime,
      };

      await authRepositories.createSession(session);
      await sendEmail(
        user.email,
        "E-Commerce Ninja Login",
        `Dear ${
          user.lastName || user.email
        }\n\nUse This Code To Confirm Your Account: ${otp}`
      );

      const isTokenExist = await authRepositories.findTokenByDeviceIdAndUserId(
        device,
        user.id
      );
      if (isTokenExist) {
        return res.status(httpStatus.OK).json({
          message: "Check your Email for OTP Confirmation",
          UserId: { userId: user.id },
          data: { token: isTokenExist },
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Check your Email for OTP Confirmation",
        UserId: { userId: user.id },
      });
    }
    const passwordMatches = await comparePassword(
      req.body.password,
      user.password
    );
    if (!passwordMatches) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid Email or Password" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server error", data: error.message });
  }
};

const verifyUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    let user: any = null;
    if (req?.params?.token) {
      const decodedToken = await decodeToken(req.params.token);
      user = await authRepositories.findUserByAttributes("id", decodedToken.id);
    }
    if (req?.body?.email) {
      user = await authRepositories.findUserByAttributes(
        "email",
        req.body.email
      );
    }

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ status: httpStatus.NOT_FOUND, message: "Account not found." });
    }
    if (!user.isVerified) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Account is not verified.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isSessionExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const session = await authRepositories.findSessionByAttributes(
      "userId",
      req.user.id
    );
    if (!session) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: httpStatus.BAD_REQUEST, message: "Invalid token." });
    }
    const destroy = await authRepositories.destroySessionByAttribute(
      "userId",
      req.user.id,
      "token",
      session.token
    );
    if (destroy) {
      const hashedPassword = await hashPassword(req.body.password);
      req.user.password = hashedPassword;
      next();
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isProductExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const shop = await productRepositories.findShopByAttributes(
      Shops,
      "userId",
      req.user.id
    );
    if (!shop) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ status: httpStatus.NOT_FOUND, message: "Not shop found." });
    }
    const isProductAvailable =
      await productRepositories.findByModelsAndAttributes(
        Products,
        "name",
        "shopId",
        req.body.name,
        shop.id
      );
    if (isProductAvailable) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Please update the quantities.",
      });
    }
    req.shop = shop;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const credential = async (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: usersAttributes = null;
    if (req.user.id) {
      user = await authRepositories.findUserByAttributes("id", req.user.id);
    }
    const compareUserPassword = await comparePassword(
      req.body.oldPassword,
      user.password
    );
    if (!compareUserPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ status: httpStatus.BAD_REQUEST, message: "Invalid password." });
    }

    const hashedPassword = await hashPassword(req.body.newPassword);
    user.password = hashedPassword;
    req.user = user;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isShopExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const shop = await productRepositories.findShopByAttributes(
      db.Shops,
      "userId",
      req.user.id
    );
    if (shop) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Already have a shop.",
        data: { shop: shop },
      });
    }
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isSellerShopExist = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const shop = await productRepositories.findShopByAttributes(
      Shops,
      "userId",
      req.user.id
    );
    if (!shop) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ status: httpStatus.NOT_FOUND, message: "Shop not found" });
    }
    req.shop = shop;
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const transformFilesToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ status: 400, message: "Images are required" });
  }

  const files = req.files as Express.Multer.File[];
  req.body.images = files.map((file) => file.path);
  next();
};

const verifyOtp = async (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authRepositories.findUserByAttributes(
      "id",
      req.params.id
    );
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found.",
      });
    }

    const sessionData = await authRepositories.findSessionByUserIdOtp(
      user.id,
      req.body.otp
    );

    if (!sessionData || !sessionData.otp) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid or expired code.",
      });
    }

    if (new Date() > sessionData.otpExpiration) {
      await authRepositories.destroySessionByAttribute(
        "userId",
        user.id,
        "otp",
        req.body.otp
      );
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "OTP expired.",
      });
    }
    await authRepositories.destroySessionByAttribute(
      "userId",
      user.id,
      "otp",
      req.body.otp
    );
    req.user = user;
    next();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isUserVerified = async (req: any, res: Response, next: NextFunction) => {
  const user: usersAttributes = await authRepositories.findUserByAttributes(
    "email",
    req.body.email
  );
  if (!user)
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid Email or Password" });
  if (user.isVerified === false)
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: "Your account is not verified yet",
    });

  req.user = user;
  return next();
};

const isUserEnabled = async (req: any, res: Response, next: NextFunction) => {
  if (req.user.status !== "enabled")
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: "Your account is disabled",
    });
  return next();
};

const isGoogleEnabled = async (req: any, res: Response, next: NextFunction) => {
  if (req.user.isGoogleAccount)
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: httpStatus.UNAUTHORIZED,
      message: "This is google account, please login with google",
    });
  return next();
};

const isCartExist = async (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartRepositories.getCartsByUserId (req.user.id);
    if (!cart) {
    return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "No cart found. Please create a cart first." });
  }
  req.cart = cart;
  return next();
    
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};

const isProductIdExist = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productRepositories.findProductById(
      req.body.productId || req.params.id
    );
    if (!product)
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "No product with that ID.",
      });
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
};


const isCartIdExist = async (req: any, res: Response, next: NextFunction) => {
  const cartId = req.params.cartId || req.body.cartId;
  if (!cartId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Cart ID is required."
    });
  }
  const cart = await cartRepositories.getCartByUserIdAndCartId(req.user.id, cartId);
  if (!cart) {
    return res.status(httpStatus.NOT_FOUND).json({
      status: httpStatus.NOT_FOUND,
      message: "Cart not found. Please add items to your cart."
    });
  }
  req.cart = cart;
  return next();
};


const isCartProductExist = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await cartRepositories.getProductByCartIdAndProductId(
      req.cart.id,
      req.params.productId
    );
    if (!product)
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "Product not found.",
      });
    req.product = product;
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isPaginated = (req: any, res: Response, next: NextFunction) => {
  const limit: number | undefined = req.query.limit
    ? Number(req.query.limit)
    : undefined;
  const page: number | undefined = req.query.page
    ? Number(req.query.page)
    : undefined;

  req.pagination = {
    limit,
    page,
    offset: limit && page ? (page - 1) * limit : undefined,
  };

  next();
};

const isSearchFiltered = (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  const name = req.query.name || undefined;
  const category = req.query.category || undefined;
  const description = req.query.description || undefined;
  const minPrice = req.query.minprice || undefined;
  const maxPrice = req.query.maxprice || undefined;

  const searchQuery: any = { where: {} };

  if ((minPrice && !maxPrice) || (!minPrice && maxPrice)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Minimum and maximum price are required",
    });
  }

  if (Number(minPrice) > Number(maxPrice)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message: "Minimum Price must be less than Maximum price",
    });
  }

  const orConditions = [];

  if (name !== undefined)
    orConditions.push({ name: { [Op.iLike]: `%${name}%` } });
  if (category !== undefined) orConditions.push({ category });
  if (description !== undefined)
    orConditions.push({ description: { [Op.iLike]: `%${description}%` } });
  if (minPrice !== undefined && maxPrice !== undefined) {
    orConditions.push({
      price: {
        [Op.gte]: minPrice,
        [Op.lte]: maxPrice,
      },
    });
  }

  if (orConditions.length > 0) {
    searchQuery.where[Op.or] = orConditions;
  }
  searchQuery.where.status = "available";
  searchQuery.where.expiryDate = {
    [Op.gte]: currentDate,
  };

  req.searchQuery = searchQuery;
  return next();
};
const isProductExistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productRepositories.findProductById(req.params.id);
    if (!product) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ status: httpStatus.NOT_FOUND, message: "No product found." });
    }
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};
const isProductExistToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productRepositories.findProductfromWishList(
      req.params.id,
      req.user.id
    );
    if (product) {
      return res.status(httpStatus.OK).json({
        message: "Product is added to wishlist successfully.",
        data: { product },
      });
    }
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isUserWishlistExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const wishList = await productRepositories.findProductFromWishListByUserId(
      req.user.id
    );
    if (!wishList || wishList.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "No wishlist Found",
      });
    }
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isUserWishlistExistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productRepositories.findProductfromWishList(
      req.params.id,
      req.user.id
    );
    if (!product) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Product Not Found From WishList",
      });
    }
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const isNotificationsExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    let notifications: any;
    if (req.params.id) {
      notifications = await db.Notifications.findOne({ where: { id: req.params.id, userId } });
      if (!notifications) {
        return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Notification not found" });
      }
    } else {
      notifications = await db.Notifications.findAll({ where: { userId } });
      if (!notifications.length) {
        return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Notifications not found" });
      }
    }
    (req as any).notifications = notifications;
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

export {
  validation,
  isUserExist,
  isAccountVerified,
  verifyUserCredentials,
  isUsersExist,
  isProductExist,
  isShopExist,
  transformFilesToBody,
  credential,
  isSessionExist,
  verifyUser,
  isGoogleEnabled,
  isUserEnabled,
  isUserVerified,
  isSellerShopExist,
  verifyOtp,
  isPaginated,
  isSearchFiltered,
  isCartIdExist,
  isProductIdExist,
  isCartExist,
  isCartProductExist,
  isProductExistById,
  isProductExistToWishlist,
  isUserWishlistExist,
  isUserWishlistExistById,
  isNotificationsExist
};