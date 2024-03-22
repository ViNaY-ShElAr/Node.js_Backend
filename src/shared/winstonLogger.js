/* eslint-disable no-unused-vars */
const winston = require('winston');
const morgan = require('morgan');
const config = require('../../config/config');
const env = process.env.ENV || 'development';
const serviceName = 'NJ_PROJECT';

class CxLogger {
    logger;

    requestLogger;

    constructor() {
        this.#configure();
    }

    #getLogger() {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.timestamp(),
                winston.format.splat(),
                winston.format.json(),
            ),
            level: config.LOGGING_LEVEL,
            headerBlacklist: ['x-access-token'],
            defaultMeta: { service: serviceName, env: env },
            transports: [new winston.transports.Console()],
        });
    }

    #getRequestLogger() {
        morgan.token('body', (req, res) => {
            return JSON.stringify(req.body);
        });
        morgan.token('params', (req, res) => JSON.stringify(req.params));
        morgan.token('query', (req, res) => JSON.stringify(req.query));
        morgan.token('headers', (req, res) => JSON.stringify(req.headers));
        morgan.token('rqId', (req, res) => req.id);
        morgan.token('service', (req, res) => serviceName);
        morgan.token('env', (req, res) => env);

        return function (options = { body: true }) {
            return morgan((tokens, req, res) => {
                if (req.path === '/status' || req.path === '/health') {
                    return;
                }
                const morganOptions = {
                    url: tokens.url(req, res),
                    method: tokens.method(req, res),
                    code: Number(tokens.status(req, res)),
                    took: Number(tokens['response-time'](req, res)),
                    token: tokens.req(req, res, 'token'),
                    query: tokens.query(req, res),
                    params: tokens.params(req, res),
                    time: tokens.date(req, res, 'iso'),
                    service: tokens.service(req, res),
                    headers: tokens.headers(req, res),
                    rqId: tokens.rqId(req, res),
                    env: tokens.env(req, res),
                };

                if (options.body && options.body === true) {
                    morganOptions.body = tokens.body(req, res);
                }
                return JSON.stringify(morganOptions);
            });
        };
    }

    #configure() {
        this.logger = this.#getLogger();
        this.requestLogger = this.#getRequestLogger();
    }
}
module.exports = new CxLogger();
