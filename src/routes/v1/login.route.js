const { Router } = require('express');
const { validate } = require('../../validation/index.js');
const loginController = require('../../controllers/v1/login.controller.js');

class LoginRoute {
    route;

    constructor() {
        this.route = Router();
        this.#handleRoutes();
    }

    #handleRoutes() {
        this.route.post('/user', validate('login.schema', 'create'), loginController.loginUser);
    }
}

module.exports = new LoginRoute().route;
