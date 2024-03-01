const Joi = require('joi');

module.exports = {

    create: Joi.object({
        body: Joi.object({
            emailId: Joi.string().email().required()
        })
    }).unknown(true)

};