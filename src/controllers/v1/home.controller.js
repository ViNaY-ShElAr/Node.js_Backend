const { RESPONSE_CONSTANTS } = require('../../constants/constant');
const responseHandler = require('../../middlewares/responseHandler.middleware');
const { logger } = require('../../shared/winstonLogger');

class homeController {

    constructor() {

    }

    getHomePage = async (req, res) => {
        const loggerInfo = {
            identifier: req.id,
            requestedBy: req.accessToken
        };
        logger.info('Get Home Page', loggerInfo);
        try {

            res.locals.httpStatusCode = RESPONSE_CONSTANTS.HOME.SUCESS.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.HOME.SUCESS.MESSAGE;

        } catch (error) {
            loggerInfo.error = error.stack;
            logger.error(`${error.message}`, loggerInfo);
            res.locals.err = error.message
        }

        return responseHandler(req, res);
    }
}

module.exports = new homeController();