import Account from "../models/Account.model.js";
import PasswordResetCodeModel from "../models/PasswordResetCode.model.js";
import bcrypt from "bcrypt";
import TokenService from "./Token.service.js";
import { customAlphabet } from "nanoid";
import sendEmail from "../utils/mailer.js";
 
class AuthService {
    async login(req, res) {
        try {
            const findAccount = await Account.findOne({
                $or: [{ email: req.body.email }, { username: req.body.email }],
            });
            if (!findAccount) {
                return res
                    .status(401)
                    .json({ error: "Wrong email or Username" });
            }
            const comparePassword = await bcrypt.compare(
                req.body.password,
                findAccount.password
            );
            if (!comparePassword) {
                return res.status(401).json({ error: "Wrong password" });
            }
            const {  password, refreshToken, ...others } = findAccount._doc;
            if (findAccount && comparePassword) {
                const genAccessToken = await TokenService.genAccessToken(
                    findAccount._doc
                );
                const genRefreshToken = await TokenService.genRefreshToken(
                    findAccount._doc
                );

                res.cookie("accessToken", genAccessToken, {
                    httpOnly: false,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                await Account.findByIdAndUpdate(
                    { _id: findAccount.id },
                    { refreshToken: genRefreshToken }
                );
                return res
                    .status(200)
                    .json({
                        message: "Login Successfully",
                        data: { ...others },
                    });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
    async register(req, res) {
        const { email,username, password, name } = req.body;

        try {
            const checkEmailExists = await Account.findOne({ email: email });
            if (checkEmailExists !== null)
                return res.status(400).json({ message: "Email has exists" });
            const checkUsername = await Account.findOne({username})
            if (checkUsername !== null) {
                return res.status(400).json({ message: "Username has exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await Account.create({
                username,
                name,
                email,
                password: hashedPassword,
            }).then((data) => {
                return res.status(201).json({
                    message: "Register Successfully",
                    data: {
                        username: data.username,
                        name: data.name,
                        email: data.email,
                    },
                });
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
    async logout(req, res) {
        res.clearCookie("accessToken");
        return res.status(200).json("Logout successful");
    }
    async forgotPasswordHandler(req, res) {
        const account = await Account.findOne({ email: req.body.email });
        if (!account) {
            return res.status(400).json({ message: "User not found" });
        }

        const nanoid = customAlphabet("1234567890", 6);
        const passwordResetCode = nanoid();

        const newPasswordResetCode = await PasswordResetCodeModel.create({
            code: passwordResetCode,
        });
        account.passwordResetCode = newPasswordResetCode._id;
        await account.save();

        await sendEmail({
            from: "trantrungnguyenad@gmail.com",
            to: account.email,
            subject: "Reset your password",
            text: `Password reset code: ${passwordResetCode}`,
        });
        return res
            .status(200)
            .json({
                message: "Check Email",
                data: { accountId: account._doc._id },
            });
    }

    async verifyPasswordResetCode(req, res) {
        const { id, passwordResetCode } = req.body;
        const account = await Account.findById(id).populate(
            "passwordResetCode"
        );
        if (!account) {
            return res.send("Account not found");
        } else if (account.passwordResetCode === null) {
            return res.send("Code reset password is expires time !!");
        } else if (account.passwordResetCode.code !== passwordResetCode) {
            return res.send(
                "Code verify is not correct, please check in email again !!"
            );
        } else if (account.passwordResetCode.code === passwordResetCode) {
            return res.status(200).json({ message: "Verify Successfully" });
        }
    }

    async resetPasswordHandler(req, res) {
        const { password, id, passwordResetCode } = req.body;
        const account = await Account.findById(id);

        if (!account) {
            return res
                .status(400)
                .json({
                    message:
                        "Could not reset user password, because account not found !!",
                });
        } else {
            account.passwordResetCode = null;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            account.password = hashedPassword;
            await account.save();
            return res
                .status(201)
                .json({ message: "Successfully updated password" });
        }
    }
}

export default new AuthService();
