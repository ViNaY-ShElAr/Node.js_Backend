const RedisOperations = require('../../databases/redis/operations/operations.js');
const { RESPONSE_CONSTANTS, REDIS_KEYS } = require('../../constants/constant');
const responseHandler = require('../../middlewares/responseHandler.middleware');
const { logger } = require('../../shared/winstonLogger');

class LogoutController {

    constructor() {
        this.redisOperations = new RedisOperations();
    }

    logoutUser = async (req, res) => {
        const loggerInfo = {
            identifier: req.id
        };
        logger.info('Logout User', loggerInfo);
        try {

            const emailId = req.body.emailId.toLowerCase();

            // Remove token from redis
            const removeUserAccessToken = await this.redisOperations.deleteKey(`${REDIS_KEYS.USER_ACCESS_TOKEN}::${emailId}`);

            res.locals.httpStatusCode = RESPONSE_CONSTANTS.LOGOUT.LOGOUT_SUCESS.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.LOGOUT.LOGOUT_SUCESS.MESSAGE;

        } catch (error) {
            loggerInfo.error = error.stack;
            logger.error(`${error.message}`, loggerInfo);
            res.locals.err = error.message
        }

        return responseHandler(req, res);
    }
}

module.exports = new LogoutController();