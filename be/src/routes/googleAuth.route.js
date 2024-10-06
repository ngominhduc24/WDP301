import express from "express";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import * as dotenv from "dotenv";
import GoogleAuthService from "../services/GoogleAuth.service.js";
import TokenService from "../services/Token.service.js";
import AccountModel from "../models/Account.model.js";
dotenv.config();

const GoogleAuthRoute = express.Router();

let userProfile;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      GoogleAuthService.loginWithGoogle(profile);
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

GoogleAuthRoute.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
GoogleAuthRoute.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/error",
    successRedirect: "/api/v1/auth/google/success",
  }),
  (req, res) => {
    res.redirect("/api/v1/auth/google/success"); // Successful authentication, redirect success.
  }
);

GoogleAuthRoute.get("/success", async (req, res) => {
  try {
    const Account = await AccountModel.findOne({
      email: req.session.passport.user.emails[0].value,
    });
    const genAccessToken = TokenService.genAccessToken(Account._doc);
    res.cookie("accessToken", genAccessToken, {
      httpOnly: false,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    const { refreshToken, passwordResetCode, imageStores, ...other } =
      Account._doc;
    return res.status(200).json({ message: "Login successfully", data: other });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

GoogleAuthRoute.get("/error", (req, res) =>
  res.send("Error logging in via Google..")
);

export default GoogleAuthRoute;
