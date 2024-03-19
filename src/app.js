const express = require('express');
const requestId = require('express-request-id')();
const expressUserAgent = require('express-useragent');
const { createServer } = require("http");
const bodyParser = require('body-parser');
const cors = require("cors");
const compression = require('compression');
const helmet = require("helmet");
require('dotenv').config();

const CONFIG = require('../config/config.js');
const databases = require('./helper/initDatabases.js');
const socket = require('./helper/initSocket.js');
const { requestLogger, logger } = require('./shared/winstonLogger.js');

global.dbConnections = {};

class App {
    app;
    httpServer;

    constructor() {
        (async () => {
            this.app = express();
            this.httpServer = createServer(this.app);
            await this.#setConfiguration();
            await this.#initializeSocket();
            this.#startServer();
        })();
    }

    async #setConfiguration() {
        try {
            await this.#connectDatabases();
            this.#configMiddleware();
            this.#handleRoutes();

        } catch (error) {
            console.log(error)
            logger.error(`Error in SetConfiguration ${error}`);
            process.exit(1);
        }
    }

    async #connectDatabases() {
        logger.info('Connecting to databases');
        await databases.init();
        logger.info('Databases connected');
    }

    #configMiddleware() {
        logger.info('Configuring Middleware');
        this.app.use((req, res, next) => {
            res.set('startTime', (new Date()).getTime());
            next();
        });
        this.app.use(expressUserAgent.express());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false,
        }));
        this.app.use(cors({ origin: "*" }));
        this.app.use(requestId);
        this.app.use(requestLogger());
        this.app.use(compression());
        this.app.use(helmet());
        this.app.disable('x-powered-by');
        logger.info('Middleware configured');
    }

    #handleRoutes() {
        logger.info('Configuring Routes');
        this.app.use(`${CONFIG.APP.PREFIX}/api/v1`, require('./routes/v1/index.route.js'));
        logger.info('Routes configured');
    }

    async #initializeSocket() {
        logger.info('Configuring Socket');
        await socket.connect(this.httpServer);
        logger.info('Socket configured ');
    }

    #startServer() {
        logger.info('Starting Server');
        this.httpServer.listen(process.env.PORT, () => {
            logger.info(`Server started on port ${process.env.PORT}`);
        });
    }
}

module.exports = new App();
