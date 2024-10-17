import Account from '../models/Account.model.js'
import TokenService from './Token.service.js';


const GoogleAuthService = {
    loginWithGoogle: async (profile) => {
        try {
            const isUserExists = await Account.findOne({
                email: profile.emails[0].value,
            });
            if (isUserExists) {
                const genRefreshToken = await TokenService.genRefreshToken(isUserExists._doc);
                isUserExists.refreshToken = genRefreshToken;
                if (isUserExists.avatar === null) {
                    isUserExists.avatar = profile.photos[0].value;
                }
                await isUserExists.save();
            }
            else {

                const account = new Account({
                    name: profile.displayName,
                    provider: profile.provider,
                    email: profile.emails[0].value, //optional - storing it as extra info
                    avatar: profile.photos[0].value, //optional
                });
                const genRefreshToken = await TokenService.genRefreshToken(account._doc);
                account.refreshToken = genRefreshToken;
                await account.save();

            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default GoogleAuthService