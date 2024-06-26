"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const http_status_1 = __importDefault(require("http-status"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("../helpers");
const authRepositories_1 = __importDefault(require("../modules/auth/repository/authRepositories"));
dotenv_1.default.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL_PRO}/api/auth/google/callback`,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    const userId = profile.id;
    const email = profile.emails?.[0].value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const picture = profile.photos?.[0].value;
    const gender = profile.gender?.[0].value;
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
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
const googleVerify = passport_1.default.authenticate("google", {
    scope: ["profile", "email"]
});
const authenticateWithGoogle = (req, res, next) => {
    passport_1.default.authenticate("google", async (err, user) => {
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const email = user.email;
        try {
            const register = await authRepositories_1.default.findUserByAttributes("email", email);
            if (register) {
                const token = (0, helpers_1.generateToken)(register.id);
                const sessions = {
                    userId: register.id,
                    device: req.headers["user-device"],
                    token: token,
                    otp: null
                };
                await authRepositories_1.default.createSession(sessions);
                res.status(http_status_1.default.OK).json({ message: "Logged in successfully", data: { token } });
            }
            else {
                const newUser = await authRepositories_1.default.createUser({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.accToken,
                    profilePicture: user.picture,
                    isGoogleAccount: true,
                    isVerified: true
                });
                const token = (0, helpers_1.generateToken)(newUser.id);
                const session = {
                    userId: newUser.id,
                    device: req.headers["user-device"],
                    token: token,
                    otp: null
                };
                await authRepositories_1.default.createSession(session);
                res.status(http_status_1.default.OK).json({ message: "Logged in successfully", data: { token } });
            }
        }
        catch (error) {
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error", data: error.message });
        }
    })(req, res, next);
};
exports.default = { passport: passport_1.default, googleVerify, authenticateWithGoogle };
//# sourceMappingURL=googleAuth.js.map