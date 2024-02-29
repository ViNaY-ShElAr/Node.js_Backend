const bcrypt = require('bcrypt');

const UserOperations = require('../../databases/mongodb/operations/user.operations.js');
const RedisOperations = require('../../databases/redis/operations/operations.js');
const jwtServices = require('../../helper/jwtToken.js');
const CONFIG = require('../../../config/config.js');
const { RESPONSE_CONSTANTS, REDIS_KEYS } = require('../../constants/constant');
const responseHandler = require('../../middlewares/responseHandler.middleware');
const { logger } = require('../../shared/winstonLogger');

class SignupController {

  constructor() {
    this.userOperations = new UserOperations();
    this.redisOperations = new RedisOperations();
  }

  // Note: When we call an arrow function then constructor is also called but in case of simple async function only function is called
  createUser = async (req, res) => {
    const loggerInfo = {
      identifier: req.id
    };
    logger.info('Signup User', loggerInfo);
    try {

      const userName = req.body.userName;
      const emailId = req.body.emailId.toLowerCase();
      const contactNo = req.body.contactNo;
      let password = req.body.password;
      const role = 2

      // Check if user already registered
      const isUserExistInDb = await this.userOperations.getUserInfoByEmailId(emailId);
      if (isUserExistInDb) {
        res.locals.httpStatusCode = RESPONSE_CONSTANTS.SIGNUP.ALREADY_SIGNUP.HTTP_STATUS;
        res.locals.message = RESPONSE_CONSTANTS.SIGNUP.ALREADY_SIGNUP.MESSAGE;
        return responseHandler(req, res);
      }

      // Encrpyt pass
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      // Save user data in database
      const savedUserData = await this.userOperations.createUser({ userName, emailId, contactNo, password, role })

      // Create JWT token 
      const tokenData = {
        userId: savedUserData.id,
        emailId: savedUserData.emailId,
        role: savedUserData.role
      }
      const token = await jwtServices.createLoginToken(tokenData);

      // Store token in redis
      const storeUserAccessToken = await this.redisOperations.setKeyWithExpiry(`${REDIS_KEYS.USER_ACCESS_TOKEN}::${emailId}`, token, CONFIG.JWT_TOKEN.EXPIRY_TIME_IN_SECONDS);

      res.locals.httpStatusCode = RESPONSE_CONSTANTS.SIGNUP.SIGNUP_SUCESS.HTTP_STATUS;
      res.locals.message = RESPONSE_CONSTANTS.SIGNUP.SIGNUP_SUCESS.MESSAGE;
      res.locals.data = {
        "userData": savedUserData,
        "token": token
      }

    } catch (error) {
      loggerInfo.error = error.stack;
      logger.error(`${error.message}`, loggerInfo);
      res.locals.err = error.message
    }

    return responseHandler(req, res);
  }
}

module.exports = new SignupController();