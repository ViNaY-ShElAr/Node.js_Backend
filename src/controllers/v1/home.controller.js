const UserOperations = require('../../databases/mongodb/operations/user.operations.js');
const CONFIG = require('../../../config/config.js');
const { RESPONSE_CONSTANTS } = require('../../constants/constant');
const responseHandler = require('../../middlewares/responseHandler.middleware');
const { logger } = require('../../shared/winstonLogger');

class homeController {

    constructor() {
        this.userOperations = new UserOperations();

    }

    getHomePage = async (req, res) => {
        const loggerInfo = {
            identifier: req.id,
            requestedBy: req.accessToken
        };
        logger.info('Get Home Page', loggerInfo);
        try {

            const userEmailId = req.accessToken.emailId;

            const userData = await this.userOperations.getUserInfoByEmailId(userEmailId);
            userData.profilePic = userData.profilePic ? userData.profilePic : CONFIG.FILES.BLANK_PROFILE_PIC;

            res.locals.httpStatusCode = RESPONSE_CONSTANTS.HOME.SUCESS.HTTP_STATUS;
            res.locals.message = RESPONSE_CONSTANTS.HOME.SUCESS.MESSAGE;
            res.locals.data = userData

        } catch (error) {
            loggerInfo.error = error.stack;
            logger.error(`${error.message}`, loggerInfo);
            res.locals.err = error.message
        }

        return responseHandler(req, res);
    }
}

module.exports = new homeController();