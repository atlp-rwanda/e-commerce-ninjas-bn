/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import passport from "passport";
import session from "express-session";
import {
  Strategy as GoogleStrategy,
  VerifyCallback
} from "passport-google-oauth2";
import dotenv from "dotenv";

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

      callbackURL: `${process.env.SERVER_URL_DEV}/api/auth/google/callback`,

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

export default { passport, googleVerify, googlecallback, SESSION };
