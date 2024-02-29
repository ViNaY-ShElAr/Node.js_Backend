const { Router } = require('express');
const homeController = require('../../controllers/v1/home.controller.js');
const auth = require('../../middlewares/auth.middleware.js');

class HomeRoute {
    route;

    constructor() {
        this.route = Router();
        this.#handleRoutes();
    }

    #handleRoutes() {
        this.route.get('/main-page', auth, homeController.getHomePage);
    }
}

module.exports = new HomeRoute().route;
