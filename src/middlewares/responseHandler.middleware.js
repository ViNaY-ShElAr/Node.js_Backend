const { RESPONSE_CONSTANTS } = require('../constants/constant')

function responseHandler(req, res, next) {
	const { err, data, message, statusCode, httpStatusCode, extras } = res.locals;

	if (!err && !data && !message) {
		return res.status(RESPONSE_CONSTANTS.GENERAL.NOT_FOUND.HTTP_STATUS).json({ message: RESPONSE_CONSTANTS.GENERAL.NOT_FOUND.MESSAGE, data: [] });
	}

	const result = {
		message: message || 'Success',
		data: data || [],
		responseTime: (new Date()).getTime() - res.get('startTime'),
		...extras,
	};

	if (err) {
		return res.status(httpStatusCode || statusCode || RESPONSE_CONSTANTS.GENERAL.INTERNAL_SERVER_ERROR.HTTP_STATUS).json({ message: RESPONSE_CONSTANTS.GENERAL.INTERNAL_SERVER_ERROR.MESSAGE, error: err });
	}

	result.statusCode = statusCode || httpStatusCode || RESPONSE_CONSTANTS.GENERAL.OK.HTTP_STATUS;
	return res.status(httpStatusCode || statusCode || RESPONSE_CONSTANTS.GENERAL.OK.HTTP_STATUS).json(result);

}

module.exports = responseHandler;