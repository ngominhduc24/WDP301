import express from "express";
import AccountController from "../controllers/Account.controller.js";
import validateData from "../validations/ValidateData.js";
import accountValidate from "../validations/Account.validate.js";
const AccountRoute = express.Router();


AccountRoute.put("/profile/change-password", validateData(accountValidate.validateChangePassword), AccountController.changePassword);
AccountRoute.get("/profile", AccountController.getProfile);
AccountRoute.put("/profile", validateData(accountValidate.validateProfile), AccountController.updateProfile);

export default AccountRoute;
