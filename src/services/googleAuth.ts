/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2";
import dotenv from "dotenv";
import authRepositories from "../modules/auth/repository/authRepositories";
import { generateToken } from "../helpers";
import { userInfo } from "../types";

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
      // eslint-disable-next-line quotes

      callbackURL: `${process.env.SERVER_URL_PRO}/api/auth/auth/google/callback`,

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
      const email = profile.emails?.[0].value || null;
      const firstName = profile.name?.givenName || null;
      const lastName = profile.name?.familyName || null;
      const picture = profile.photos?.[0].value || null;
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

const googlecallback = passport.authenticate("google", {
  failureRedirect: "/"
});

const SESSION = session({
  secret: process.env.Session_secret,
  resave: false,
  saveUninitialized: true
});

const authenticated = async (req: Request,res: Response,next: NextFunction) => {
  if ((req as any).isAuthenticated()) {
    const { email } = req.user as userInfo;
    const register = await authRepositories.findUserByAttributes("email", email);
    if (register) {
      const token = generateToken(register.id);
      const sessions = { userId: register.id, device: req.headers["user-device"], token: token, otp: null };
      await authRepositories.createSession(sessions);
      return res.status(200).json({ status: 200, token: token });
    } else {
      next();
    }
  } else {
    return res.json({ Error: "Something Went Wrong" });
  }
};

export default {
  passport,
  googleVerify,
  googlecallback,
  SESSION,
  authenticated
};
