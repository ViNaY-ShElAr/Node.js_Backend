const bcrypt = require('bcrypt');

const UserOperations = require('../../databases/mongodb/operations/user.operations.js');
const RedisOperations = require('../../databases/redis/operations/operations.js');
const jwtServices = require('../../helper/jwtToken.js');
const CONFIG = require('../../../config/config.js');
const { RESPONSE_CONSTANTS, REDIS_KEYS } = require('../../constants/constant');
const responseHandler = require('../../middlewares/responseHandler.middleware');
const { logger } = require('../../shared/winstonLogger');

class LoginController {

    constructor() {
        this.userOperations = new UserOperations();
        this.redisOperations = new RedisOperations();
    }

    loginUser = async (req, res) => {
        const loggerInfo = {
            identifier: req.id
        };
        logger.info('Login User', loggerInfo);
        try {

            const emailId = req.body.emailId.toLowerCase();
            let password = req.body.password;

            // Check if user exist in database or not
            const userData = await this.userOperations.getUserInfoByEmailId(emailId);
            if (!userData) {
                res.locals.httpStatusCode = RESPONSE_CONSTANTS.LOGIN.USER_NOT_EXIST.HTTP_STATUS;
                res.locals.message = RESPONSE_CONSTANTS.LOGIN.USER_NOT_EXIST.MESSAGE;
                return responseHandler(req, res);
            }

            // Check if password correct or not
            const isPasswordMatched = await bcrypt.compare(password, userData.password);
            if (!isPasswordMatched) {
                res.locals.httpStatusCode = RESPONSE_CONSTANTS.LOGIN.INVAlID_CREDENTIAlS.HTTP_STATUS;
                res.locals.message = RESPONSE_CONSTANTS.LOGIN.INVAlID_CREDENTIAlS.MESSAGE;
                return responseHandler(req, res);
            }

            // Create JWT token 
            const tokenData = {
                userId: userData.id,
                emailId: userData.emailId,
                role: userData.role
            }
            const token = await jwtServices.createLoginToken(tokenData);

            // Store token in redis
            const storeUserAccessToken = await this.redisOperations.setKeyWithExpiry(`${REDIS_KEYS.USER_ACCESS_TOKEN}::${emailId}`, token, CONFIG.JWT_TOKEN.EXPIRY_TIME_IN_SECONDS);

            res.locals.httpStatusCode = RESPONSE_CONSTANTS.LOGIN.LOGIN_SUCESS.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.LOGIN.LOGIN_SUCESS.MESSAGE;
            res.locals.data = {
                "token": token
            }

        } catch (error) {
            loggerInfo.error = error.stack;
            logger.error(`${error.message}`, loggerInfo);
            res.locals.err = error.message
        }

        return responseHandler(req, res);
    }
}

module.exports = new LoginController();