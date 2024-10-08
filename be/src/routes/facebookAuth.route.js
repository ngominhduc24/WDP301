import express from "express";
import passport from "passport";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import * as dotenv from 'dotenv'
import AccountModel from '../models/Account.model.js';
import TokenService from "../services/Token.service.js";
import FacebookAuthService from "../services/FacebookAuth.service.js";
dotenv.config();

const FacebookAuthRoute = express.Router();

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'photos', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            FacebookAuthService.loginWithFacebook(profile);
            return done(null, profile);
        }
    )
);

FacebookAuthRoute.get("/", passport.authenticate('facebook', { scope: 'email' }))
FacebookAuthRoute.get('/callback',
    passport.authenticate('facebook', { successRedirect: process.env.CLIENT_URL, failureRedirect: "/api/v1/auth/facebook/error" }),
    function (req, res) {
        res.redirect('/api/v1/auth/facebook/success');
    });
FacebookAuthRoute.get("/success",async (req,res) => {
    try { 
        const Account = await AccountModel.findOne({email: req.session.passport.user.emails[0].value})
        const genAccessToken = TokenService.genAccessToken(Account._doc);
        res.cookie("accessToken", genAccessToken, {
            httpOnly: false,
            secure: false,
            path: "/",
            sameSite: "lax",
        });
        const {refreshToken,passwordResetCode,imageStores, ...other} = Account._doc
        return res.status(200).json({message: "Login successfully" , data : other});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})
FacebookAuthRoute.get('/error', (req, res) => res.send('Error logging in via Facebook ...'));

export default FacebookAuthRoute