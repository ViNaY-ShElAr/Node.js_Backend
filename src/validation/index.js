const { logger } = require('../shared/winstonLogger');

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

                return res.status(400).send({
                    status_code: 400,
                    message: "Invalid Input",
                    error: error.message
                })
            }
        };
    }

}

module.exports = new Validation();