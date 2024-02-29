const { Router } = require('express');
const { validate } = require('../../validation/index.js');
const signupController = require('../../controllers/v1/signup.controller.js');

class SignupRoute {
    route;

    constructor() {
        this.route = Router();
        this.#handleRoutes();
    }

    #handleRoutes() {
        this.route.post('/user', validate('signup.schema', 'create'), signupController.createUser);
    }
}

module.exports = new SignupRoute().route;
