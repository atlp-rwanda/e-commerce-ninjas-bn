/* eslint-disable curly */
/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import authRepositories from "../modules/auth/repository/authRepositories";
import Users, { usersAttributes } from "../databases/models/users";
import httpStatus from "http-status";
import { comparePassword, decodeToken, generateOTP, generateRandomCode, hashPassword } from "../helpers";
import productRepositories from "../modules/product/repositories/productRepositories";
import Shops from "../databases/models/shops";
import Products from "../databases/models/products";
import { ExtendRequest } from "../types";
import { sendEmail } from "../services/sendEmail";

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

const verifyUserCredentials = async (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authRepositories.findUserByAttributes("email", req.body.email);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Email or Password" });
    }
    if (user.is2FAEnabled) {
      const { otp, expirationTime } = generateOTP();
      const device: any = req.headers["user-device"] || null;

      const session = {
        userId: user.id,
        device,
        otp: otp,
        otpExpiration: expirationTime
      };

      await authRepositories.createSession(session);
      await sendEmail(user.email, "E-Commerce Ninja Login", `Dear ${user.lastName || user.email}\n\nUse This Code To Confirm Your Account: ${otp}`);

      const isTokenExist = await authRepositories.findTokenByDeviceIdAndUserId(device, user.id);
      if (isTokenExist) {
        return res.status(httpStatus.OK).json({
          message: "Check your Email for OTP Confirmation",
          UserId: { userId: user.id },
          data: { token: isTokenExist }
        });
      }

      return res.status(httpStatus.OK).json({
        message: "Check your Email for OTP Confirmation",
        UserId: { userId: user.id }
      });
    }
    const passwordMatches = await comparePassword(req.body.password, user.password);
    if (!passwordMatches) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Email or Password" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error", data: error.message });
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
      user = await authRepositories.findUserByAttributes("email", req.body.email);
    }

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Account not found." });
    }
    if (!user.isVerified) {
      return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Account is not verified." });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const isSessionExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const session = await authRepositories.findSessionByAttributes("userId", req.user.id);
    if (!session) {
      return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Invalid token." });
    }
    const destroy = await authRepositories.destroySessionByAttribute("userId", req.user.id, "token", session.token);
    if (destroy) {
      const hashedPassword = await hashPassword(req.body.newPassword);
      req.user.password = hashedPassword;
      next()
    }

  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
}

const isProductExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const shop = await productRepositories.findShopByAttributes(Shops, "userId", req.user.id);
    if (!shop) {
      return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Not shop found." });
    }
    const isProductAvailable = await productRepositories.findByModelsAndAttributes(Products, "name", "shopId", req.body.name, shop.id);
    if (isProductAvailable) {
      return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Please update the quantities." });
    }
    req.shop = shop;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
}

const credential = async (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    let user: usersAttributes = null;
    if (req.user.id) {
      user = await authRepositories.findUserByAttributes("id", req.user.id);
    }
    const compareUserPassword = await comparePassword(req.body.oldPassword, user.password);
    if (!compareUserPassword) {
      return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Invalid password." });
    }

    const hashedPassword = await hashPassword(req.body.newPassword);
    user.password = hashedPassword;
    req.user = user;
    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};


const isShopExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const shop = await productRepositories.findShopByAttributes(Shops, "userId", req.user.id)
    if (shop) {
      return res.status(httpStatus.BAD_REQUEST).json({ status: httpStatus.BAD_REQUEST, message: "Already have a shop.", data: { shop: shop } });
    }
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
}

const isSellerShopExist = async (req: any, res: Response, next: NextFunction) => {
  try {
    const shop = await productRepositories.findShopByAttributes(Shops, "userId", req.user.id)
    if (!shop) {
      return res.status(httpStatus.NOT_FOUND).json({ status: httpStatus.NOT_FOUND, message: "Shop not found" });
    }
    req.shop = shop;
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
}

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

const verifyOtp = async (req: ExtendRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authRepositories.findUserByAttributes("id", req.params.id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: httpStatus.NOT_FOUND,
        message: "User not found."
      });
    }

    const sessionData = await authRepositories.findSessionByUserIdOtp(user.id, req.body.otp);

    if (!sessionData || !sessionData.otp) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid or expired code."
      });
    }

    if (new Date() > sessionData.otpExpiration) {
      await authRepositories.destroySessionByAttribute("userId", user.id, "otp", req.body.otp);
      return res.status(httpStatus.BAD_REQUEST).json({
        status: httpStatus.BAD_REQUEST,
        message: "OTP expired."
      });
    }
    await authRepositories.destroySessionByAttribute("userId", user.id, "otp", req.body.otp);
    req.user = user;
    next();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message
    });
  }
};



const isUserVerified = async (req: any, res: Response, next: NextFunction) => {
  const user: usersAttributes = await authRepositories.findUserByAttributes(
    "email",
    req.body.email
  );
  if (!user) return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Email or Password" });
  if (user.isVerified === false) return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.UNAUTHORIZED, message: "Your account is not verified yet" })

  req.user = user;
  return next();
}

const isUserEnabled = async (req: any, res: Response, next: NextFunction) => {
  if (req.user.status !== "enabled") return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.UNAUTHORIZED, message: "Your account is disabled" })
  return next();
}

const isGoogleEnabled = async (req: any, res: Response, next: NextFunction) => {
  if (req.user.isGoogleAccount) return res.status(httpStatus.UNAUTHORIZED).json({ status: httpStatus.UNAUTHORIZED, message: "This is google account, please login with google" })
  return next();
}


const isPaginationSelected = (req: any, res: Response, next: NextFunction) => {
  const limit: number | undefined = req.query.limit ? Number(req.query.limit) : undefined;
  const page: number | undefined = req.query.page ? Number(req.query.page) : undefined;

  req.pagination = {
    limit,
    page,
    offset: limit && page ? (page - 1) * limit : undefined,
  };

  next();
};


export {
  validation,
  isUserExist,
  isAccountVerified,
  verifyUserCredentials, isUsersExist,
  isProductExist, isShopExist,
  transformFilesToBody, credential,
  isSessionExist, verifyUser, isGoogleEnabled,
  isUserEnabled, isUserVerified, isSellerShopExist,
  verifyOtp,
  isPaginationSelected
};