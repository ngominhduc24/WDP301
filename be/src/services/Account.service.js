import Account from "../models/Account.model.js";
import bcrypt from "bcrypt";
import getCurrentUser from "../utils/getCurrentUser.js";

class AccountService {
    async getProfile(req, res) {
        try {
            const accountId = getCurrentUser(req);
            const profile = await Account.findById(accountId);
            if (!profile) {
                return res.send("Account not found !!");
            }

            const {
                password,
                refreshToken,
                passwordResetCode,
                imageStores,
                ...other
            } = profile._doc;
            return res.status(200).json({
                data: other,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const accountId = getCurrentUser(req);
            const account = await Account.findById(accountId);
            if (!account) {
                return res.send("Account not found !!");
            }

            const {
                name,
                phone,
                avatar,
                payosClientId,
                payosAPIKey,
                payosCheckSum,
            } = req.body;
            await Account.findByIdAndUpdate(accountId, {
                name,
                phone,
                avatar,
                payosClientId,
                payosAPIKey,
                payosCheckSum,
            });

            Account.findById(accountId).then((data) => {
                const {
                    password,
                    _id,
                    refreshToken,
                    passwordResetCode,
                    imageStores,
                    ...other
                } = data._doc;
                return res.status(200).json({
                    message: "Update Successfully",
                    data: other,
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
    async changePassword(req, res) {
        try {
            const accountId = getCurrentUser(req);
            const { oldPassword, newPassword } = req.body;
            const account = await Account.findById(accountId);
            if (!account) {
                res.status(200).json({
                    success: false,
                    message: "Tài khoản không tồn tại !",
                });
            } else {
                const comparePassword = await bcrypt.compare(
                    oldPassword,
                    account.password
                );
                if (!comparePassword) {
                    return res.status(200).json({
                        success: false,
                        message: "Mật khẩu cũ không đúng !",
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);
                    account.password = hashedPassword;
                    await account.save();
                    return res.status(200).json({
                        success: true,
                        message: "Đổi mật khẩu thành công",
                    });
                }
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
}

export default new AccountService();
