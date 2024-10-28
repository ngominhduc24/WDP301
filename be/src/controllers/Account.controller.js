import AccountService from "../services/Account.service.js";
import asyncHandler from "../utils/async-handler.js";

const AccountController = {
  getAll: asyncHandler(async (req, res) => {
    await AccountService.getAll(req, res);
  }),
  createAccount: asyncHandler(async (req, res) => {
    await AccountService.createAccount(req, res);
  }),
  getProfile: asyncHandler(async (req, res) => {
    await AccountService.getProfile(req, res);
  }),
  updateProfile: asyncHandler(async (req, res) => {
    await AccountService.updateProfile(req, res);
  }),
  changePassword: asyncHandler(async (req, res) => {
    await AccountService.changePassword(req, res);
  }),
};
export default AccountController;
