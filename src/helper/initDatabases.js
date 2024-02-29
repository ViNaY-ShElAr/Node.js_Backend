const mongoService = require('../databases/mongodb/connect');
const redisService = require('../databases/redis/connect');
const { logger } = require('../shared/winstonLogger');

class Databases {
    async init() {
        try {

            global.dbConnections.mongoClient = await mongoService.connectDB();

            global.dbConnections.redisClient = await redisService.connectDB();

        } catch (error) {
            logger.error(`${{ op: "Database/init", msg: error.message }}`);
            return Promise.reject(error);
        }
    }
}
module.exports = new Databases();
