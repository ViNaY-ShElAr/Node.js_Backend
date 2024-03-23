const { logger } = require('../shared/winstonLogger');
const {RESPONSE_CONSTANTS} = require('../constants/constant')

class Validation {

    validate(type, schema) {
        const loggerInfo = {};
        return async (req, res, next) => {
            try {
                const validationConfig = require(`./requestSchema/${type}`);

                await validationConfig[schema].validateAsync(req);

                return next();
            } catch (error) {

                loggerInfo.error = error.stack;
                logger.error(error.message, loggerInfo);

                return res.status(RESPONSE_CONSTANTS.GENERAL.BAD_REQUEST.HTTP_STATUS).send({
                    status_code: RESPONSE_CONSTANTS.GENERAL.BAD_REQUEST.HTTP_STATUS,
                    message: RESPONSE_CONSTANTS.GENERAL.BAD_REQUEST.MESSAGE,
                    error: error.message
                })
            }
        };
    }

}

module.exports = new Validation();