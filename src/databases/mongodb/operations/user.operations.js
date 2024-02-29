const { MODEL_NAMES } = require('../../../constants/constant');

class UserOperations {

    constructor() {
        const mongoConn = global.dbConnections.mongoClient;
        this.userModel = mongoConn.model(MODEL_NAMES.USERS);
    }

    async getUserInfoByEmailId(emailId) {
        const query = { emailId: emailId }
        const userInfo = await this.userModel.findOne(query);
        return userInfo;
    }

    async createUser(userData) {
        const query = new this.userModel(userData);
        const savedUser = await query.save();
        return savedUser;
    }
}
module.exports = UserOperations