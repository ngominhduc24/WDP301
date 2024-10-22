import Account from "../models/Account.model.js";
import bcrypt from "bcrypt";
import getCurrentUser from "../utils/getCurrentUser.js";

class AccountService {
  async getAll(req, res) {
    try {
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitPerPage = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitPerPage;
        
        const { houseId } = req.params;

        const rooms = await Room.find({ houseId});
        const totalAccounts = await Account.countDocuments({ roomId: { $in: rooms.map((room) => room._id) } });
        const data = await Account.find({ roomId: { $in: rooms.map((room) => room._id) } })
                .skip(skip)
                .limit(limitPerPage)
                .sort({ createdAt: -1 })
                .exec();

        const totalPages = Math.ceil(totalAccounts / limitPerPage);

        return res.status(201).json({
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalAccounts: totalAccounts,
                accountsPerPage: data.length,
            },
            data: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

async createAccount(req, res) {
    const { email,username, role, name } = req.body;
    try {
        const checkEmailExists = await Account.findOne({ email: email });
        if (checkEmailExists !== null)
            return res.status(400).json({ message: "Email has exists" });
        const checkUsername = await Account.findOne({username})
        if (checkUsername !== null) {
            return res.status(400).json({ message: "Username has exists" });
        }

        // const nanoid = customAlphabet("1234567890ABCdef", 10);
        // const password = '@Fpt1' + nanoid();
        const password = "Admin@123";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const accountData = await Account.create({
            username,
            name,
            email,
            password: hashedPassword,
            accountType: role,
        });

        return res.status(201).json({
            message: "Create Successfully",
            data: {
                username: accountData.username,
                name: accountData.name,
                email: accountData.email,
                accountType: accountData.accountType,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
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

      const { name, phone, avatar, payosClientId, payosAPIKey, payosCheckSum } =
        req.body;
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
