const Joi = require('joi');

module.exports = {

    create: Joi.object({
        body: Joi.object({
            userName: Joi.string().required(),
            emailId: Joi.string().email().required(),
            contactNo: Joi.string().length(10),
            password: Joi.string().required()
        })
    }).unknown(true)
};