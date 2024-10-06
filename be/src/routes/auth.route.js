import express from "express";
import AuthController from "../controllers/Auth.controller.js";
import validateData from "../validations/ValidateData.js";
import accountValidate from "../validations/Account.validate.js";
import {verifyToken} from "../middlewares/verifyToken.middleware.js";
const AuthRoute = express.Router();

AuthRoute.post("/verify-password-reset-code", AuthController.verifyPasswordResetCode);
AuthRoute.post("/reset-password", validateData(accountValidate.validateNewPassword), AuthController.resetPasswordHandler);
AuthRoute.post("/forgot-password", AuthController.forgotPasswordHandler);
AuthRoute.post("/login", AuthController.login);
AuthRoute.post("/register", validateData(accountValidate.validateRegister), AuthController.register);
AuthRoute.get("/logout", verifyToken, AuthController.logout)


export default AuthRoute;