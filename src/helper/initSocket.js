/* eslint-disable no-console */
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');

const RedisService = require('../databases/redis/connect');
const { logger } = require("../shared/winstonLogger")

class Socket {
    #io;
    mapping = {};

    async connect(app) {
        try {
            this.#io = new Server(app, {
                cors: '*',
                path: '/api/v1/socket',
                transports: ['websocket'],
            });
            const pubClient = await RedisService.connectDB();
            const subClient = await RedisService.connectDB();
            this.#io.adapter(createAdapter(pubClient, subClient));
            logger.info('Socket ready');
            this.#handleEvents();
        } catch (error) {
            logger.error(`${{ op: "socket/connect", msg: error.message }, error}`);
            return Promise.reject(error);
        }
    }

    #handleEvents() {
        // Implement socket middleware
        this.#io.use(async (socket, next) => {

            console.log('Socket in middleware');
            next();
        })
            .on('connection', (socket) => {
                console.log('A user connected');

                socket.on('disconnect', () => {
                    console.log('User disconnected');
                });

                socket.on('chat message', (msg) => {
                    console.log('message: ' + msg);
                    this.#io.emit('chat message', msg);
                });
            });
    }
}

module.exports = new Socket();
