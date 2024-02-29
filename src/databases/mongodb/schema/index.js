const { MODEL_NAMES } = require('../../../constants/constant');
const UserSchema = require('./user.schema');

class MongooseSchema {
    static async registerModels(conn) {
        conn.model(MODEL_NAMES.USERS, new UserSchema().Schema);
    }
}

module.exports = MongooseSchema;
