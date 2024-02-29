const redis = require('ioredis');

const { logger } = require("../../shared/winstonLogger")

class Redis {

	async connectDB() {
		return new Promise((resolve, reject) => {
			const redisUri = process.env.PROJECT_REDIS_URI;
			const redisClient = new redis(redisUri);

			redisClient.on("connect", () => {
				logger.info("Redis Connected");
				resolve(redisClient);
			});

			redisClient.on("error", (error) => {
				logger.error(`${{ op: "Redis/connectDB", msg: error.message }, error}`);
				reject(error);
			});
		});
	}
}
module.exports = new Redis()