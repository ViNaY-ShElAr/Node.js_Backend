const { Router } = require('express');
const createError = require('http-errors');

const responseHandler = require('../../middlewares/responseHandler.middleware');
const signupRoute = require('./signup.route.js');
const loginRoute = require('./login.route.js');
const logoutRoute = require('./logout.route.js');
const homeRoute = require('./home.route.js');

class IndexRouter {
    router;

    constructor() {
        this.router = Router();
        this.#handleRoutes();
        this.#handleResponse();
    }

    #handleRoutes() {
        this.router.use('/signup', signupRoute);
        this.router.use('/login', loginRoute);
        this.router.use('/logout', logoutRoute);
        this.router.use('/home', homeRoute);

        this.router.get('/health', (req, res) => res.json({
            message: 'All OK',
        }));
    }

    #handleResponse() {
        this.router.use(responseHandler);
    }

    #handleNotFound() {
        this.router.use((req, res, next) => {
            next(createError(404));
        });
    }
}

module.exports = new IndexRouter().router;
