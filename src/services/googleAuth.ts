/* eslint-disable no-inner-declarations */
/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request,Response,NextFunction } from "express";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback
} from "passport-google-oauth2";
import httpStatus from "http-status";
import dotenv from "dotenv";
import { userInfo } from "../types";
import { generateToken } from "../helpers";
import authRepositories from "../modules/auth/repository/authRepositories";


dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,

      callbackURL: `${process.env.SERVER_URL_PRO}/api/auth/google/callback`,

      passReqToCallback: true
    },
    function (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) {
      const userId = profile.id;
      const email = profile.emails?.[0].value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const picture = profile.photos?.[0].value;
      const gender = profile.gender?.[0].value
      const accToken = accessToken;
      const user = {
        userId,
        email,
        firstName,
        lastName,
        picture,
        accToken
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const googleVerify = passport.authenticate("google", {
  scope: ["profile", "email"]
});

const authenticateWithGoogle = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", async (err: unknown, user: userInfo | null) => {
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({status:httpStatus.UNAUTHORIZED, message: "Authentication failed" });
    }
    const email = user.email;
    try {
      const register = await authRepositories.findUserByAttributes("email", email);
      
      if (register) {
        if(register.dataValues.isGoogleAccount){
        const token = generateToken(register.id);
        const sessions = {
          userId: register.id,
          device: req.headers["user-device"],
          token: token,
          otp: null
        };
        await authRepositories.createSession(sessions);
        res.status(httpStatus.OK).json({status:httpStatus.OK, message: "Logged in successfully", data: { token } });
      }
      else{
        res.status(httpStatus.BAD_REQUEST).json({status:httpStatus.BAD_REQUEST, message: "this is not google account, please login with Normal Account"});
      }
      } else {
        const newUser = await authRepositories.createUser({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.accToken,
          profilePicture: user.picture,
          isGoogleAccount: true,
          isVerified: true
        });

        const token = generateToken(newUser.id);
        const session = {
          userId: newUser.id,
          device: req.headers["user-device"],
          token: token,
          otp: null
        };
        await authRepositories.createSession(session);
        res.status(httpStatus.OK).json({status:httpStatus.OK, message: "Logged in successfully", data: { token} });
      }
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({status:httpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
  })(req, res, next);
};



export default { passport, googleVerify , authenticateWithGoogle };