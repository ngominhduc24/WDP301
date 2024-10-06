import Account from '../models/Account.model.js'
import TokenService from './Token.service.js';


const FacebookAuthService = {
    loginWithFacebook: async (profile) => {
        try {
            const isUserExists = await Account.findOne({
                email: profile.emails[0].value,
            });
            if (isUserExists) {
                const genRefreshToken = await TokenService.genRefreshToken(isUserExists._doc);
                isUserExists.refreshToken = genRefreshToken;                
                await isUserExists.save();
            }
            else {
                const account = new Account({
                    name: profile.displayName,
                    provider: profile.provider,
                    email: profile.emails[0].value,
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

export default FacebookAuthService