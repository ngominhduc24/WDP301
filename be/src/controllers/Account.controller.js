import AccountService from '../services/Account.service.js';
import asyncHandler from '../utils/async-handler.js';

const AccountController = {

    getProfile: asyncHandler(async (req, res) => {
        await AccountService.getProfile(req, res);
    }),
    updateProfile: asyncHandler(async (req, res) => {
        await AccountService.updateProfile(req, res);
    }),
    changePassword: asyncHandler(async (req, res) => {
        await AccountService.changePassword(req, res);
    }),
    
}
export default AccountController