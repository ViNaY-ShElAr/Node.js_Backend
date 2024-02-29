const jwtServices = require('../helper/jwtToken.js');
const RedisOperations = require('../databases/redis/operations/operations');
const { RESPONSE_CONSTANTS, REDIS_KEYS } = require('../constants/constant');
const responseHandler = require('../middlewares/responseHandler.middleware');
const { logger } = require('../shared/winstonLogger');

auth = async (req, res, next) => {
    const loggerInfo = {
        identifier: req.id
    };
    try {

        // Get token from the header
        const token = req.header('x-access-token');
        if (!token) {
            res.locals.httpStatusCode = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.MESSAGE;

            return responseHandler(req, res);
        }

        const decoded = await jwtServices.verifyLoginToken(token);
        req.accessToken = decoded;

        // Check if user has active redis session or not
        const isTokenValid = await new RedisOperations().getKey(`${REDIS_KEYS.USER_ACCESS_TOKEN}::${req.accessToken.emailId}`);
        if (!isTokenValid || isTokenValid !== token) {
            res.locals.httpStatusCode = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.MESSAGE;

            return responseHandler(req, res);
        }

        next();

    } catch (error) {
        // Handle jwt error separately
        if (error.message == 'invalid signature') {
            res.locals.httpStatusCode = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.HTTP_STATUS
            res.locals.message = RESPONSE_CONSTANTS.GENERAL.UNAUTHORIZED.MESSAGE
        } else {
            res.locals.err = error.message;
        }
        loggerInfo.error = error.stack;
        logger.error(`${error.message}`, loggerInfo);

        return responseHandler(req, res);
    }

}
module.exports = auth