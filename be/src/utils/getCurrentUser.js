import jwt from 'jsonwebtoken'
import env from '../../config/getEnv.js'
function getCurrentUser(req) {
    
    return req.user.id;
}

export default getCurrentUser