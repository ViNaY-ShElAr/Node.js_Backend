const mongoose = require('mongoose');

const MongooseSchema = require('./schema/index')
const { logger } = require("../../shared/winstonLogger");

class MongoDB {

	async connectDB() {
		try {
			const mongoUri = process.env.PROJECT_MONGO_URI;
			const mongoClient = await mongoose.connect(mongoUri);

			// registar models
			MongooseSchema.registerModels(mongoClient);

			logger.info("MongoDB Connected");
			return mongoClient;

		} catch (error) {
			logger.error(`${{ op: "MongoDB/connectDB", msg: error.message }, error}`);
			return Promise.reject(error);
		}
	}

};

module.exports = new MongoDB()