const { StatusCodes } = require('http-status-codes');

const RESPONSE_CONSTANTS = {
    GENERAL: {
        OK: {
            HTTP_STATUS: StatusCodes.OK,
            MESSAGE: "Ok"
        },
        CREATED: {
            HTTP_STATUS: StatusCodes.CREATED,
            MESSAGE: "Created"
        },
        BAD_REQUEST: {
            HTTP_STATUS: StatusCodes.BAD_REQUEST,
            MESSAGE: "Bad Request"
        },
        UNAUTHORIZED: {
            HTTP_STATUS: StatusCodes.UNAUTHORIZED,
            MESSAGE: "Unauthorized"
        },
        FORBIDDEN: {
            HTTP_STATUS: StatusCodes.FORBIDDEN,
            MESSAGE: "Forbidden"
        },
        NOT_FOUND: {
            HTTP_STATUS: StatusCodes.NOT_FOUND,
            MESSAGE: "Not Found"
        },
        INTERNAL_SERVER_ERROR: {
            HTTP_STATUS: StatusCodes.INTERNAL_SERVER_ERROR,
            MESSAGE: "Internal Server Error"
        }
    },
    SIGNUP: {
        SIGNUP_SUCESS: {
            HTTP_STATUS: StatusCodes.CREATED,
            MESSAGE: "User Register Successfully",
        },
        ALREADY_SIGNUP: {
            HTTP_STATUS: StatusCodes.BAD_REQUEST,
            MESSAGE: "User Already Registered, Please Login"
        }
    },
    LOGIN: {
        LOGIN_SUCESS: {
            HTTP_STATUS: StatusCodes.OK,
            MESSAGE: "User Successfully Logged In",
        },
        USER_NOT_EXIST: {
            HTTP_STATUS: StatusCodes.FORBIDDEN,
            MESSAGE: "Acess Denied, Please Signup"
        },
        INVAlID_CREDENTIAlS: {
            HTTP_STATUS: StatusCodes.UNAUTHORIZED,
            MESSAGE: "Invalid Credentials"
        }
    },
    HOME: {
        SUCESS: {
            HTTP_STATUS: StatusCodes.OK,
            MESSAGE: "Home page",
        }
    }
}

const MODEL_NAMES = {
    USERS: "users"
}

const REDIS_KEYS = {
    USER_ACCESS_TOKEN: "user_access_token"
}

module.exports = { RESPONSE_CONSTANTS, MODEL_NAMES, REDIS_KEYS }