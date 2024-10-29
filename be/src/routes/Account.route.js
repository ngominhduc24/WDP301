import express from "express";
import AccountController from "../controllers/Account.controller.js";
import validateData from "../validations/ValidateData.js";
import accountValidate from "../validations/Account.validate.js";
import { verifyTokenManager } from "../middlewares/verifyToken.middleware.js";
const AccountRoute = express.Router();
AccountRoute.get("/house/:houseId", verifyTokenManager, AccountController.getAll);
AccountRoute.post("/create", validateData(accountValidate.validateAccount), verifyTokenManager, AccountController.createAccount);
AccountRoute.post(
  "/create",
  validateData(accountValidate.validateAccount),
  verifyTokenManager,
  AccountController.createAccount
);
AccountRoute.put(
  "/profile/change-password",
  validateData(accountValidate.validateChangePassword),
  AccountController.changePassword
);
AccountRoute.get("/profile", AccountController.getProfile);
AccountRoute.put(
  "/profile",
  validateData(accountValidate.validateProfile),
  AccountController.updateProfile
);

export default AccountRoute;
