const { Router } = require('express');
const { validate } = require('../../validation/index.js');
const logoutController = require('../../controllers/v1/logout.controller.js');

class LogoutRoute {
    route;

    constructor() {
        this.route = Router();
        this.#handleRoutes();
    }

    #handleRoutes() {
        this.route.post('/user', validate('logout.schema', 'create'), logoutController.logoutUser);
    }
}

module.exports = new LogoutRoute().route;
